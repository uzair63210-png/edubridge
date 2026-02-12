
import React, { useState, useEffect } from 'react';
import { UserRole, type Teacher } from '../types';
import { Card } from './common/Card';
import { UserCircleIcon } from './icons/Icons';

interface TeacherDetailProps {
  teacher: Teacher;
  onUpdateTeacher: (teacher: Teacher) => void;
  userRole?: UserRole; // Added to check for Admin
}

const AVAILABLE_SUBJECTS = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 'Hindi', 'Physical Education', 'Art'
];

export const TeacherDetail: React.FC<TeacherDetailProps> = ({ teacher, onUpdateTeacher, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(teacher);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [newPicUrl, setNewPicUrl] = useState(teacher.profilePicUrl);


  useEffect(() => {
    setFormData(teacher);
    setNewPicUrl(teacher.profilePicUrl);
    setIsEditingPic(false);
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject: string, isChecked: boolean) => {
    setFormData(prev => {
        const currentSubjects = prev.subjects || [];
        if (isChecked) {
            return { ...prev, subjects: [...currentSubjects, subject] };
        } else {
            return { ...prev, subjects: currentSubjects.filter(s => s !== subject) };
        }
    });
  };

  const handleSave = () => {
    onUpdateTeacher(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(teacher);
    setIsEditing(false);
  };
  
  const handleSavePic = () => {
      onUpdateTeacher({ ...teacher, profilePicUrl: newPicUrl });
      setIsEditingPic(false);
  }
  
  const attendancePercentage = ((teacher.attendance.present / teacher.attendance.total) * 100).toFixed(1);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teacher Profile</h1>
          <p className="text-gray-500 mt-1">View and edit teacher details.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow"
          >
            Edit Profile
          </button>
        )}
      </div>

      <Card>
        <div className="flex items-center space-x-6 p-4">
           <div className="relative group w-24 h-24">
                {teacher.profilePicUrl ? (
                    <img src={teacher.profilePicUrl} alt={teacher.name} className="w-full h-full rounded-full border-4 border-blue-200 object-cover" />
                ) : (
                     <div className="w-full h-full rounded-full border-4 border-blue-200 bg-blue-50 flex items-center justify-center text-blue-300">
                         <UserCircleIcon className="w-16 h-16"/>
                    </div>
                )}
                {userRole === UserRole.Admin && (
                     <button 
                        onClick={() => setIsEditingPic(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                     >
                         Edit
                     </button>
                 )}
           </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="loginCode" className="block text-sm font-medium text-gray-700">Login Code</label>
                  <input
                    type="text"
                    name="loginCode"
                    id="loginCode"
                    value={formData.loginCode}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{teacher.name}</h2>
                <p className="text-gray-600 mt-1">
                  Login Code: <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{teacher.loginCode}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        
        {isEditingPic && (
            <div className="mt-4 p-4 bg-gray-50 border-t border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Picture URL</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newPicUrl} 
                        onChange={(e) => setNewPicUrl(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://..."
                    />
                    <button onClick={handleSavePic} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700">Save</button>
                    <button onClick={() => setIsEditingPic(false)} className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50">Cancel</button>
                </div>
            </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Assigned Subjects</h3>
            {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_SUBJECTS.map(subject => (
                        <label key={subject} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.subjects?.includes(subject)}
                                onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">{subject}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                        teacher.subjects.map(subject => (
                            <span key={subject} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                {subject}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No subjects assigned yet.</p>
                    )}
                </div>
            )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance</h3>
                 <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3" />
                        <path
                            className="text-green-500"
                            strokeDasharray={`${attendancePercentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{attendancePercentage}%</span>
                    </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{teacher.attendance.present} / {teacher.attendance.total} days</p>
            </div>
             <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Class Engagement</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{teacher.classesTaken.weekly}</p>
                  <p className="text-sm text-gray-500">Classes this week</p>
                </div>
                <div className="text-center mt-4">
                  <p className="text-xl font-bold text-gray-700">{teacher.classesTaken.total}</p>
                  <p className="text-sm text-gray-500">Total classes this term</p>
                </div>
            </div>
        </div>


        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 p-4 rounded-b-xl">
            <button
              onClick={handleCancel}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
