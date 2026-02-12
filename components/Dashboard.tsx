

import React, { useState, useEffect } from 'react';
import { UserRole, type Student, type Notice } from '../types';
import { Card } from './common/Card';

interface DashboardProps {
    notices: Notice[];
    students: Student[];
    onSelectStudent: (student: Student) => void;
    userRole: UserRole;
    onAddStudent: () => void;
    isAcademicHead?: boolean;
    student?: Student | null;
    onUpdateAttendance?: (studentId: string, newPresentCount: number) => void;
}

const StudentAttendanceCard: React.FC<{student: Student, onUpdate: (newCount: number) => void}> = ({ student, onUpdate }) => {
    const [isMarked, setIsMarked] = useState(sessionStorage.getItem(`attendance-marked-${student.id}`) === 'true');

    const handleMarkAttendance = () => {
        onUpdate(student.attendance.present + 1);
        sessionStorage.setItem(`attendance-marked-${student.id}`, 'true');
        setIsMarked(true);
    };

    return (
         <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                Today's Attendance
            </h2>
            <div className="text-center">
                {isMarked ? (
                    <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                        <p className="font-semibold">Attendance marked for today!</p>
                        <p className="text-sm">Your current attendance is {student.attendance.present}/{student.attendance.total} days.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-4">Click below to mark yourself as present for today.</p>
                        <button
                            onClick={handleMarkAttendance}
                            className="bg-green-600 text-white w-full px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow"
                        >
                            Mark as Present
                        </button>
                    </>
                )}
            </div>
        </Card>
    )
}

const NoticesCard: React.FC<{notices: Notice[], userRole: UserRole}> = ({ notices, userRole }) => {
    const relevantNotices = notices
        .filter(n => n.targetAudience.includes(userRole))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 2l7.997 3.884A2 2 0 0119 7.616V16a2 2 0 01-2 2H3a2 2 0 01-2-2V7.616a2 2 0 011.003-1.732zM10 4.218L3.59 7.519V16h12.82V7.519L10 4.218zM12 11a1 1 0 00-2 0v2a1 1 0 002 0v-2z" /></svg>
                Notices & Circulars
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {relevantNotices.length > 0 ? relevantNotices.map((notice) => (
                    <div key={notice.id} className="flex items-start justify-between p-2 rounded-md border border-l-4 border-l-yellow-400">
                        <div>
                            <p className="font-semibold text-yellow-600 text-sm">{notice.title}</p>
                            <p className="text-gray-600 text-sm">{notice.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md whitespace-nowrap">{new Date(notice.date).toLocaleDateString()}</span>
                    </div>
                )) : (
                     <p className="text-center text-gray-500 py-4">No new notices.</p>
                )}
            </div>
        </Card>
    );
};

const PrinciplesMessageCard: React.FC = () => (
    <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
            Principle & Messages
        </h2>
        <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Read</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Un-Read</div>
        </div>
        <p className="text-center text-gray-400 mt-8">No messages found.</p>
    </Card>
);

const LecturesCard: React.FC = () => (
    <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 4a1 1 0 100 2h4a1 1 0 100-2H8zm0 4a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>
            Today's Lectures
        </h2>
        <div>
            <label className="text-sm font-medium text-gray-700">Lecture Date*</label>
            <div className="flex items-center mt-1">
                <input type="date" defaultValue="2025-11-16" className="w-full p-2 border border-gray-300 rounded-md" />
                <button className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.898 0V3a1 1 0 112 0v2.101a7.002 7.002 0 01-11.898 0V3a1 1 0 01-2 0V3a1 1 0 011-1zm0 9.899a7.002 7.002 0 0111.898 0V17a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.898 0V17a1 1 0 112 0v-2.101a7.002 7.002 0 0111.898 0z" clipRule="evenodd" /></svg>
                </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">No Lectures Found...</p>
        </div>
    </Card>
);

const SocialConnectCard: React.FC<{ students: Student[] }> = ({ students }) => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentDate = today.getDate();

    const upcomingBirthdays = students.slice(0, 2).map((student, index) => ({
        name: student.name,
        date: `${currentMonth} ${currentDate + index + 3}`
    }));

    return (
        <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                 Social Connect
            </h2>
            <div className="space-y-3">
                {upcomingBirthdays.map((b, i) => (
                    <div key={i} className="flex items-center">
                        <img src={`https://i.pravatar.cc/150?u=${b.name}`} alt={b.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="text-sm text-gray-800 font-medium">{b.name}</p>
                            <p className="text-xs text-red-600 font-bold">Birthday <span className="text-gray-600 font-medium">{b.date}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ notices, students, onSelectStudent, userRole, onAddStudent, isAcademicHead, student, onUpdateAttendance }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-800">
                    {userRole === UserRole.Teacher ? "Class Dashboard" : "Dashboard"}
                </h1>
                {userRole === UserRole.Teacher && (
                    <button
                        onClick={onAddStudent}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Student
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6 lg:col-span-1 flex flex-col">
                    <NoticesCard notices={notices} userRole={userRole} />
                     {userRole === UserRole.Student && student && onUpdateAttendance && (
                       <StudentAttendanceCard student={student} onUpdate={(newCount) => onUpdateAttendance(student.id, newCount)} />
                    )}
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Online Examination</h2>
                        <p className="text-sm text-gray-500">No active examinations at the moment.</p>
                    </Card>
                </div>

                <div className="space-y-6 lg:col-span-1 flex flex-col">
                    <PrinciplesMessageCard />
                    <SocialConnectCard students={students} />
                </div>

                <div className="space-y-6 lg:col-span-1 flex flex-col">
                    <LecturesCard />
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Attention</h2>
                        <p className="text-sm text-gray-500">No new attention notices.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};