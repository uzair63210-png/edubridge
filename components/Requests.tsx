import React from 'react';
import { Card } from './common/Card';
import { type StudentRequest } from '../types';

interface RequestsProps {
  requests: StudentRequest[];
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
}

export const Requests: React.FC<RequestsProps> = ({ requests, onApprove, onDeny }) => {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Student Addition Requests</h1>
            <p className="text-gray-500">Review and approve or deny requests from teachers to add new students.</p>

            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Requests ({pendingRequests.length})</h2>
                {pendingRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-gray-600">Student Name</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Class</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Guardian</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Requested By</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(request => (
                                    <tr key={request.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{request.student.name}</td>
                                        <td className="p-3 text-gray-700 hidden md:table-cell">{request.student.class}</td>
                                        <td className="p-3 text-gray-700 hidden lg:table-cell">{request.student.guardianName}</td>
                                        <td className="p-3 text-gray-700 hidden lg:table-cell">{request.teacherName}</td>
                                        <td className="p-3 space-x-2">
                                            <button 
                                                onClick={() => onApprove(request.id)} 
                                                className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => onDeny(request.id)} 
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                                            >
                                                Deny
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">There are no pending student requests.</p>
                )}
            </Card>
        </div>
    );
};
