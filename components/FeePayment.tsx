

import React, { useState, useMemo } from 'react';
import { UserRole, View, type Student, type Fee } from '../types';
import { Card } from './common/Card';
import { StudentSubNav } from './StudentSubNav';

interface FeePaymentProps {
  student: Student;
  userRole: UserRole;
  view: View;
  setView: (view: View) => void;
  onPayFees: (studentId: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const PaymentMethods: PaymentMethod[] = [
  { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Debit/Credit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks supported' },
  { id: 'cheque', name: 'Cheque/DD', icon: '📄', description: 'Pay via bank draft' },
];

const StatusIndicator: React.FC<{ status: 'Paid' | 'Due'; label?: string }> = ({ status, label }) => {
  if (status === 'Paid') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-700 font-semibold text-sm">{label || 'Paid'}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <span className="text-red-700 font-semibold text-sm">{label || 'Outstanding'}</span>
    </div>
  );
};

const FeeRow: React.FC<{fee: Fee}> = ({ fee }) => {
    const isOverdue = new Date(fee.dueDate) < new Date() && fee.status === 'Due';
    const statusClass = fee.status === 'Paid' 
      ? 'bg-green-100 text-green-800' 
      : isOverdue
      ? 'bg-orange-100 text-orange-800'
      : 'bg-red-100 text-red-800';
    
    return (
        <tr className={`border-b hover:bg-gray-50 transition-colors ${fee.status === 'Due' && isOverdue ? 'bg-orange-50' : ''}`}>
            <td className="p-4 text-gray-800 font-medium">{fee.type}</td>
            <td className="p-4 text-gray-600 hidden md:table-cell">
              <span className={isOverdue && fee.status === 'Due' ? 'text-orange-600 font-semibold' : ''}>
                {fee.dueDate}
              </span>
            </td>
            <td className="p-4 text-gray-800 font-semibold text-right">₹{fee.amount.toFixed(2)}</td>
            <td className="p-4 text-right">
                <div className="flex justify-end">
                  <StatusIndicator status={fee.status} label={isOverdue && fee.status === 'Due' ? 'Overdue' : fee.status} />
                </div>
            </td>
        </tr>
    )
}

const PaymentHistorySection: React.FC<{ fees: Fee[] }> = ({ fees }) => {
  const paidFees = fees.filter(f => f.status === 'Paid');
  
  if (paidFees.length === 0) return null;

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Payment History
      </h3>
      <div className="space-y-3">
        {paidFees.map((fee, idx) => (
          <div key={fee.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="font-medium text-gray-800">{fee.type}</p>
              <p className="text-sm text-gray-600">Paid on {fee.dueDate}</p>
            </div>
            <span className="text-green-600 font-bold">₹{fee.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const PaymentFormModal: React.FC<{
  isOpen: boolean;
  totalDue: number;
  selectedMethod: string | null;
  onClose: () => void;
  onPay: (method: string) => void;
}> = ({ isOpen, totalDue, selectedMethod, onClose, onPay }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(selectedMethod);
  const [transactionRef, setTransactionRef] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Amount to Pay</p>
          <p className="text-3xl font-bold text-blue-600">₹{totalDue.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {PaymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-1">{method.icon}</div>
                <p className="text-xs font-semibold text-gray-800">{method.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Reference/Transaction ID</label>
          <input
            type="text"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            placeholder="Enter transaction ID or reference number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedPaymentMethod && onPay(selectedPaymentMethod)}
            disabled={!selectedPaymentMethod}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </Card>
    </div>
  );
};

const PaymentReceiptModal: React.FC<{
  isOpen: boolean;
  student: Student;
  totalPaid: number;
  onClose: () => void;
}> = ({ isOpen, student, totalPaid, onClose }) => {
  if (!isOpen) return null;

  const receiptId = `REC-${Date.now().toString().slice(-8)}`;
  const transactionDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
          <p className="text-gray-600">Receipt #{receiptId}</p>
        </div>

        <div className="border-t-2 border-b-2 border-gray-300 py-6 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Student Details</p>
              <p className="text-lg font-bold text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
              <p className="text-sm text-gray-600">Class: {student.class}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 uppercase font-semibold">Transaction Details</p>
              <p className="text-sm text-gray-800">Date: {transactionDate}</p>
              <p className="text-sm text-gray-800">Receipt ID: {receiptId}</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 text-center">
            <p className="text-sm text-gray-600">Amount Paid</p>
            <p className="text-4xl font-bold text-green-600">₹{totalPaid.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-center text-green-700 font-semibold">Payment Successful</p>
          <p className="text-center text-gray-600 text-sm">Thank you for your payment. Your fee account has been updated.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </Card>
    </div>
  );
};

export const FeePayment: React.FC<FeePaymentProps> = ({ student, userRole, view, setView, onPayFees }) => {
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const { totalDue, totalPaid, totalAmount } = useMemo(() => {
        return student.fees.reduce((acc, fee) => {
            acc.totalAmount += fee.amount;
            if (fee.status === 'Due') {
                acc.totalDue += fee.amount;
            } else {
                acc.totalPaid += fee.amount;
            }
            return acc;
        }, { totalDue: 0, totalPaid: 0, totalAmount: 0 });
    }, [student.fees]);

    const paymentPercentage = (totalPaid / totalAmount) * 100;
    const overdueCount = student.fees.filter(f => f.status === 'Due' && new Date(f.dueDate) < new Date()).length;

    const handlePayment = (method: string) => {
        setShowPaymentModal(false);
        setPaymentStatus('processing');
        setTimeout(() => {
            onPayFees(student.id);
            setPaymentStatus('success');
            setShowReceiptModal(true);
            setTimeout(() => {
              setPaymentStatus('idle');
              setShowReceiptModal(false);
            }, 5000);
        }, 2000);
    };

    const canPay = userRole === UserRole.Admin || userRole === UserRole.Parent;

    return (
        <div className="space-y-6">
            {userRole !== UserRole.Student && userRole !== UserRole.Parent && <StudentSubNav view={view} setView={setView} />}
            
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Fee Payment Portal</h1>
              {paymentPercentage === 100 && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All Fees Paid
                </span>
              )}
            </div>

            {overdueCount > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-orange-800 font-semibold">
                  ⚠️ {overdueCount} fee{overdueCount !== 1 ? 's' : ''} overdue! Please make payment to avoid penalties.
                </p>
              </div>
            )}

            {/* Payment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Total Fees</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">₹{totalAmount.toFixed(2)}</p>
                </Card>
                <Card className="text-center">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Amount Paid</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">₹{totalPaid.toFixed(2)}</p>
                    <p className="text-sm text-green-600 mt-1">{paymentPercentage.toFixed(0)}% Complete</p>
                </Card>
                <Card className="text-center">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Outstanding</p>
                    <p className={`text-3xl font-bold mt-2 ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{totalDue.toFixed(2)}</p>
                </Card>
                <Card className="text-center">
                    <p className="text-gray-500 text-sm uppercase font-semibold">Status</p>
                    <div className="mt-2">
                      <StatusIndicator status={totalDue > 0 ? 'Due' : 'Paid'} />
                    </div>
                </Card>
            </div>

            {/* Payment Progress Bar */}
            <Card>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Payment Progress</p>
                  <p className="text-sm font-bold text-gray-800">{paymentPercentage.toFixed(1)}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(paymentPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Fee Details Table */}
            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Fee Breakdown</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b-2 border-gray-300">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700">Fee Type</th>
                                <th className="p-4 font-semibold text-gray-700 hidden md:table-cell">Due Date</th>
                                <th className="p-4 font-semibold text-gray-700 text-right">Amount</th>
                                <th className="p-4 font-semibold text-gray-700 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.fees.map(fee => <FeeRow key={fee.id} fee={fee} />)}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Payment History */}
            <PaymentHistorySection fees={student.fees} />

            {/* Payment Action */}
            {totalDue > 0 && paymentStatus !== 'success' && canPay && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Outstanding Balance</h2>
                        <p className="text-gray-600 mb-2">You have an outstanding balance that needs to be paid.</p>
                        <p className="text-gray-700">
                          Amount Due: <span className="text-2xl font-bold text-red-600">₹{totalDue.toFixed(2)}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowPaymentModal(true)} 
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                      >
                        Pay Now
                      </button>
                    </div>
                </Card>
            )}

            {totalDue > 0 && !canPay && (
                 <Card className="bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-yellow-800 font-semibold">
                      💡 Fee payment is handled by parents or administration. Please contact them for payment details.
                    </p>
                </Card>
            )}

            {totalDue === 0 && (
                 <Card className="bg-green-50 border-l-4 border-green-500">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h2 className="text-xl font-bold text-green-800">All Fees Paid!</h2>
                      <p className="text-green-700 mt-2">Thank you for keeping your fee account up to date.</p>
                    </div>
                </Card>
            )}

            {/* Modals */}
            <PaymentFormModal 
              isOpen={showPaymentModal}
              totalDue={totalDue}
              selectedMethod="upi"
              onClose={() => setShowPaymentModal(false)}
              onPay={handlePayment}
            />

            <PaymentReceiptModal
              isOpen={showReceiptModal}
              student={student}
              totalPaid={totalPaid + totalDue}
              onClose={() => setShowReceiptModal(false)}
            />
        </div>
    );
};