
import React from 'react';
import { Card } from './common/Card';
import { type Student } from '../types';
import { UserCircleIcon } from './icons/Icons';

interface AttendanceViewProps {
    students: Student[];
    onUpdateAttendance: (studentId: string, newPresentCount: number) => void;
    className?: string;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ students, onUpdateAttendance, className }) => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
                {className && <p className="text-gray-600 mt-1">Class: <span className="font-semibold text-blue-600">{className}</span></p>}
                <p className="text-gray-500 mt-2">Update daily attendance for all students in this class.</p>
            </div>
            
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Student</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Current Attendance</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map(student => {
                                const attendancePercentage = student.attendance.total > 0 ? ((student.attendance.present / student.attendance.total) * 100).toFixed(1) : 0;
                                return (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 flex items-center gap-3">
                                        {student.profilePicUrl ? (
                                             <img src={student.profilePicUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                 <UserCircleIcon className="w-6 h-6"/>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800">{student.name}</p>
                                            <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{student.attendance.present} / {student.attendance.total}</span>
                                            <span className="text-xs text-gray-500">{attendancePercentage}%</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => onUpdateAttendance(student.id, student.attendance.present + 1)}
                                                disabled={student.attendance.present >= student.attendance.total}
                                                className="bg-green-100 text-green-700 px-3 py-1.5 rounded-md text-sm font-bold hover:bg-green-200 disabled:bg-gray-200 disabled:text-gray-400"
                                                aria-label={`Mark ${student.name} present`}
                                            >
                                                +1
                                            </button>
                                            <button
                                                onClick={() => onUpdateAttendance(student.id, student.attendance.present - 1)}
                                                disabled={student.attendance.present <= 0}
                                                className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-bold hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-400"
                                                aria-label={`Mark ${student.name} absent`}
                                            >
                                                -1
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-8 text-gray-500">
                                        No students found in this class.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
