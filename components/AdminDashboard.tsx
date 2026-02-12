
import React, { useState } from 'react';
import { Card } from './common/Card';
import { type SchoolData, type ClassData, type StudentRequest, View } from '../types';
import { StudentsIcon, TeacherIcon, BuildingIcon, InboxIcon, CloseIcon, TrashIcon } from './icons/Icons';
import { AddClassModal } from './AddClassModal';

// Helper to parse class name into number and division
const parseClassName = (fullClassName: string) => {
  const match = fullClassName.match(/^(\d+)\w*\s*([A-Z]?)$/);
  return {
    class: match ? match[1] : fullClassName,
    division: match ? match[2] : ''
  };
};

interface AdminDashboardProps {
    schoolData: SchoolData;
    studentRequests: StudentRequest[];
    setView: (view: View) => void;
    onSelectClass: (className: string) => void;
    onAddClass: (className: string) => void;
    onDeleteClass: (className: string) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; theme: 'blue' | 'green' | 'red'; }> = ({ title, value, icon, theme }) => {
    const themeClasses = {
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            border: 'border-t-blue-500',
        },
        green: {
            bg: 'bg-green-100',
            text: 'text-green-600',
            border: 'border-t-green-500',
        },
        red: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            border: 'border-t-red-500',
        },
    };
    const currentTheme = themeClasses[theme];

    return (
        <Card className={currentTheme.border}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${currentTheme.bg} ${currentTheme.text}`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </Card>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ schoolData, studentRequests, setView, onSelectClass, onAddClass, onDeleteClass }) => {
    const [isAddClassModalOpen, setAddClassModalOpen] = useState(false);
    
    // Explicitly cast to ClassData to avoid type errors
    const totalStudents = Object.values(schoolData).reduce((sum: number, data: unknown) => sum + (data as ClassData).students.length, 0);
    const totalTeachers = Object.values(schoolData).reduce((sum: number, data: unknown) => sum + (data as ClassData).teachers.length, 0);
    const totalClasses = Object.keys(schoolData).length;
    const pendingRequestsCount = studentRequests.filter(r => r.status === 'pending').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Students" value={totalStudents} icon={<StudentsIcon className="w-6 h-6" />} theme="blue" />
                <StatCard title="Total Teachers" value={totalTeachers} icon={<TeacherIcon className="w-6 h-6" />} theme="green" />
                <StatCard title="Total Classes" value={totalClasses} icon={<BuildingIcon className="w-6 h-6" />} theme="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Requests Card */}
                <div className="lg:col-span-1">
                    <Card>
                         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <InboxIcon className="w-5 h-5 mr-3 text-yellow-600"/>
                            Pending Actions
                        </h2>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">Student Requests</p>
                                    <p className="text-2xl font-bold text-yellow-700">{pendingRequestsCount}</p>
                                </div>
                                <button 
                                    onClick={() => setView(View.Requests)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                                >
                                    Review
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Classes Overview Card */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Classes Overview</h2>
                            <button
                                onClick={() => setAddClassModalOpen(true)}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow"
                            >
                                + Add Class
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Class</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Division</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Students</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Teachers</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Academic Head</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(schoolData).sort(([a], [b]) => a.localeCompare(b, undefined, {numeric: true})).map(([className, data]) => {
                                        const classData = data as ClassData;
                                        const academicHead = classData.teachers.find(t => t.id === classData.academicHeadId);
                                        const { class: classNum, division } = parseClassName(className);
                                        return (
                                            <tr key={className} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium text-blue-600 cursor-pointer" onClick={() => onSelectClass(className)}>{classNum}</td>
                                                <td className="p-3 font-semibold text-blue-700 bg-blue-50 rounded cursor-pointer" onClick={() => onSelectClass(className)}>{division || '-'}</td>
                                                <td className="p-3 text-gray-700 cursor-pointer" onClick={() => onSelectClass(className)}>{classData.students.length}</td>
                                                <td className="p-3 text-gray-700 cursor-pointer" onClick={() => onSelectClass(className)}>{classData.teachers.length}</td>
                                                <td className="p-3 text-gray-700 cursor-pointer" onClick={() => onSelectClass(className)}>{academicHead?.name || 'N/A'}</td>
                                                <td className="p-3 text-right">
                                                    <button 
                                                        onClick={() => onDeleteClass(className)} 
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        aria-label={`Delete Class ${classNum} ${division}`}
                                                        title="Delete Class"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
            <AddClassModal isOpen={isAddClassModalOpen} onClose={() => setAddClassModalOpen(false)} onSubmit={onAddClass} />
        </div>
    );
};
