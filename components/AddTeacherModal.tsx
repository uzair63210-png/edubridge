
import React, { useState } from 'react';
import { CloseIcon } from './icons/Icons';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacherName: string) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Teacher</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">Teacher's Full Name</label>
              <input
                type="text"
                name="teacherName"
                id="teacherName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Jane Doe"
                autoFocus
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
