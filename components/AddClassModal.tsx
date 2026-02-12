
import React, { useState } from 'react';
import { CloseIcon } from './icons/Icons';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (className: string) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [classNumber, setClassNumber] = useState('');
  const [division, setDivision] = useState('');
  const divisions = ['A', 'B', 'C', 'D', 'E'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classNumber.trim()) {
      const fullClassName = division ? `${classNumber.trim()} ${division}` : classNumber.trim();
      onSubmit(fullClassName);
      setClassNumber('');
      setDivision('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Add New Class</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
             <div>
               <label htmlFor="classNumber" className="block text-sm font-medium text-gray-700">Class Number (e.g., 6, 7, 8)</label>
               <input
                  type="text"
                  id="classNumber"
                  value={classNumber}
                  onChange={(e) => setClassNumber(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 6"
                  autoFocus
               />
             </div>
             <div>
               <label htmlFor="division" className="block text-sm font-medium text-gray-700">Division (Optional)</label>
               <select
                  id="division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
               >
                  <option value="">Select Division</option>
                  {divisions.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
               </select>
               <p className="text-xs text-gray-500 mt-1">Examples: 6 A, 6 B, 6 C</p>
             </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md text-sm">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm">Add Class</button>
          </div>
        </form>
      </div>
    </div>
  );
};
