
import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { type Teacher, type Student, type Score } from '../types';

interface AcademicsViewProps {
    teacher: Teacher;
    students: Student[];
    onUpdateScore: (studentId: string, subject: string, newScore: number) => void;
}

const ScoreInput: React.FC<{ studentId: string; subject: string; initialScore: number; onUpdateScore: (studentId: string, subject: string, newScore: number) => void; }> = ({ studentId, subject, initialScore, onUpdateScore }) => {
    const [score, setScore] = useState(initialScore);

    useEffect(() => {
        setScore(initialScore);
    }, [initialScore]);
    
    const handleBlur = () => {
        if (score !== initialScore) {
            onUpdateScore(studentId, subject, score);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newScore = parseInt(e.target.value, 10) || 0;
        if (newScore > 100) newScore = 100;
        if (newScore < 0) newScore = 0;
        setScore(newScore);
    };

    return (
        <input
            type="number"
            value={score}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            max="100"
            min="0"
            aria-label={`Score for ${subject}`}
        />
    );
};

export const AcademicsView: React.FC<AcademicsViewProps> = ({ teacher, students, onUpdateScore }) => {
    if (!teacher || teacher.subjects.length === 0) {
        return (
            <Card>
                <h1 className="text-xl font-bold text-gray-800">Academics Management</h1>
                <p className="mt-4 text-gray-600">You have no subjects assigned. Please contact an administrator.</p>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Academic Scores</h1>
            <p className="text-gray-500">Update student scores for your assigned subjects after examinations.</p>
            
            <Card>
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                    <h2 className="text-lg font-semibold text-gray-800">Your Subjects</h2>
                    <p className="text-blue-800 font-medium">{teacher.subjects.join(', ')}</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Student Name</th>
                                {teacher.subjects.map(subject => (
                                    <th key={subject} className="p-3 text-sm font-semibold text-gray-600 text-center">{subject}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map(student => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-800">{student.name}</td>
                                    {teacher.subjects.map(subject => {
                                        const studentScore = student.scores.find(s => s.subject === subject)?.score ?? 0;
                                        return (
                                            <td key={subject} className="p-3 text-center">
                                                <ScoreInput
                                                    studentId={student.id}
                                                    subject={subject}
                                                    initialScore={studentScore}
                                                    onUpdateScore={onUpdateScore}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={teacher.subjects.length + 1} className="text-center p-8 text-gray-500">
                                        There are no students in this class yet.
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