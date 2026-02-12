
import React from 'react';
import { type Student } from '../types';
import { Card } from './common/Card';
import { UserCircleIcon } from './icons/Icons';

interface TeacherStudentSelectionProps {
    students: Student[];
    onSelectStudent: (student: Student) => void;
}

export const TeacherStudentSelection: React.FC<TeacherStudentSelectionProps> = ({ students, onSelectStudent }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Select a Student</h1>
            <p className="text-gray-500">Choose a student from your class to view their detailed profile.</p>
            {students.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {students.map(student => (
                        <Card key={student.id} className="text-center transform hover:-translate-y-1 transition-transform duration-200">
                            {student.profilePicUrl ? (
                                <img src={student.profilePicUrl} alt={student.name} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md object-cover" />
                            ) : (
                                <div className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-gray-400">
                                     <UserCircleIcon className="w-16 h-16"/>
                                </div>
                            )}
                            <h3 className="mt-4 font-bold text-gray-800">{student.name}</h3>
                            <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                            <button
                                onClick={() => onSelectStudent(student)}
                                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow"
                            >
                                View Profile
                            </button>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500 py-8">No students found in this class. You can add a new student from the dashboard.</p>
                </Card>
            )}
        </div>
    );
};
