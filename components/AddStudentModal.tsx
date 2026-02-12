
import React, { useState, useEffect } from 'react';
import { UserRole, type Student, type SchoolData } from '../types';
import { CloseIcon } from './icons/Icons';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: Omit<Student, 'id'>) => void;
  userRole: UserRole;
  teacherClass: string | null;
  schoolData: SchoolData | null;
}

const initialStudentState: Omit<Student, 'id'> = {
    name: '',
    class: '',
    rollNumber: 0,
    guardianName: '',
    contact: '',
    address: '',
    profilePicUrl: '',
    skills: [{ skill: 'Teamwork', level: 3 }, { skill: 'Creativity', level: 3 }],
    scores: [{ subject: 'Mathematics', score: 75 }, { subject: 'Science', score: 80 }],
    attendance: { total: 180, present: 160 },
    fees: [{ id: `fee-${Date.now()}`, type: 'Tuition', amount: 1500, dueDate: '2024-09-01', status: 'Due' }],
    digitalDocuments: [],
};

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSubmit, userRole, teacherClass, schoolData }) => {
  const [studentData, setStudentData] = useState(initialStudentState);

  useEffect(() => {
    if (isOpen) {
        if (userRole === UserRole.Teacher && teacherClass) {
            setStudentData(prev => ({ ...prev, class: teacherClass }));
        } else {
            // Reset class for admin or if teacher class is not set
            setStudentData(initialStudentState);
        }
    }
  }, [isOpen, userRole, teacherClass]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: name === 'rollNumber' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === UserRole.Admin && !studentData.class) {
        alert("Please select a class for the student.");
        return;
    }
    onSubmit(studentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {userRole === UserRole.Admin && (
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  id="class"
                  name="class"
                  value={studentData.class}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a class</option>
                  {schoolData && Object.keys(schoolData).sort().map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            )}
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Student Name</label>
              <input type="text" name="name" id="name" value={studentData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input type="number" name="rollNumber" id="rollNumber" value={studentData.rollNumber} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700">Guardian Name</label>
              <input type="text" name="guardianName" id="guardianName" value={studentData.guardianName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="tel" name="contact" id="contact" value={studentData.contact} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" name="address" id="address" value={studentData.address} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            {userRole === UserRole.Admin && (
                <div>
                  <label htmlFor="profilePicUrl" className="block text-sm font-medium text-gray-700">Profile Picture URL (Optional)</label>
                  <input type="text" name="profilePicUrl" id="profilePicUrl" value={studentData.profilePicUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://..." />
                </div>
            )}
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
              {userRole === UserRole.Admin ? 'Add Student' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
