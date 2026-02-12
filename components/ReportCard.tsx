
import React from 'react';
import { type Student } from '../types';
import { CloseIcon } from './icons/Icons';

interface ReportCardProps {
    student: Student;
    onClose: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ student, onClose }) => {
    const today = new Date().toLocaleDateString('en-GB');

    // Calculate Grades
    const getGrade = (score: number) => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'E';
    };

    const getRemarks = (score: number) => {
        if (score >= 80) return 'Excellent performance';
        if (score >= 60) return 'Good understanding';
        if (score >= 40) return 'Satisfactory';
        return 'Needs improvement';
    };

    const totalMarks = student.scores.reduce((sum, s) => sum + s.score, 0);
    const maxMarks = student.scores.length * 100;
    const percentage = student.scores.length > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;

    const handleShareWhatsApp = () => {
        const text = `*Student Report Card*\n\nName: ${student.name}\nClass: ${student.class} (Roll No: ${student.rollNumber})\n\n*Performance Summary:*\nTotal Score: ${percentage}%\nAttendance: ${Math.round((student.attendance.present/student.attendance.total)*100)}%\nResult: ${percentage >= 40 ? 'Promoted' : 'Retained'}\n\nView detailed report at school office.`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">
                 <div className="p-4 border-b flex justify-between items-center bg-gray-50 print:hidden sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>
                        </span>
                        Preview Report Card
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleShareWhatsApp}
                            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            Share on WhatsApp
                        </button>
                         <button 
                            onClick={() => window.print()} 
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                            Print / Save PDF
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 md:p-12 print:p-0 font-serif text-gray-900 bg-white min-h-[800px]" id="printable-report">
                     {/* Header */}
                     <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                        <div className="flex justify-between items-start mb-6">
                             <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-blue-100">
                                EDU
                             </div>
                             <div className="text-center flex-1 px-4">
                                 <h1 className="text-4xl font-bold uppercase tracking-wider text-blue-900">EduBridge School</h1>
                                 <p className="text-gray-600 italic mt-1 font-medium">Excellence in Digital Education</p>
                                 <p className="text-sm text-gray-500 mt-1">123, Knowledge Park, Education District, India</p>
                             </div>
                             {/* Photo */}
                             <div className="w-24 h-24 bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                {student.profilePicUrl ? (
                                     <img src={student.profilePicUrl} alt="Student" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">Student Photo</div>
                                 )}
                             </div>
                        </div>
                        <h2 className="text-2xl font-bold uppercase mt-6 inline-block border-b-4 border-double border-gray-800 pb-1">Annual Progress Report</h2>
                        <p className="mt-2 text-lg font-medium text-gray-600">Academic Year: 2024-2025</p>
                     </div>

                     {/* Student Info Grid */}
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-lg">
                            <div className="flex justify-between border-b border-gray-300 pb-1">
                                <span className="font-bold text-gray-700">Student Name:</span>
                                <span className="font-medium">{student.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-1">
                                <span className="font-bold text-gray-700">Roll Number:</span>
                                <span className="font-mono">{student.rollNumber}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-1">
                                <span className="font-bold text-gray-700">Class:</span>
                                <span className="font-medium">{student.class}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-1">
                                <span className="font-bold text-gray-700">Guardian Name:</span>
                                <span className="font-medium">{student.guardianName}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-1">
                                <span className="font-bold text-gray-700">Date of Birth:</span>
                                <span className="font-medium">--/--/----</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-1">
                                <span className="font-bold text-gray-700">Attendance:</span>
                                <span className="font-medium">{student.attendance.present}/{student.attendance.total} Days ({Math.round((student.attendance.present/student.attendance.total)*100)}%)</span>
                            </div>
                        </div>
                     </div>

                     {/* Academic Table */}
                     <div className="mb-8">
                        <h3 className="text-lg font-bold mb-3 uppercase text-blue-900 border-l-4 border-blue-900 pl-3">Part 1: Scholastic Areas</h3>
                        <table className="w-full border-collapse border border-gray-400 text-sm md:text-base">
                            <thead>
                                <tr className="bg-blue-50 text-blue-900">
                                    <th className="border border-gray-400 p-3 text-left w-1/3 font-bold">Subject</th>
                                    <th className="border border-gray-400 p-3 text-center font-bold">Max. Marks</th>
                                    <th className="border border-gray-400 p-3 text-center font-bold">Marks Obt.</th>
                                    <th className="border border-gray-400 p-3 text-center font-bold">Grade</th>
                                    <th className="border border-gray-400 p-3 text-left font-bold">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.scores.map(score => (
                                    <tr key={score.subject}>
                                        <td className="border border-gray-400 p-3 font-semibold text-gray-800">{score.subject}</td>
                                        <td className="border border-gray-400 p-3 text-center text-gray-600">100</td>
                                        <td className="border border-gray-400 p-3 text-center font-medium">{score.score}</td>
                                        <td className="border border-gray-400 p-3 text-center font-bold text-blue-800">{getGrade(score.score)}</td>
                                        <td className="border border-gray-400 p-3 italic text-gray-600">
                                            {getRemarks(score.score)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
                                    <td className="border border-gray-400 p-3 text-right text-gray-800">Grand Total</td>
                                    <td className="border border-gray-400 p-3 text-center">{maxMarks}</td>
                                    <td className="border border-gray-400 p-3 text-center text-blue-900">{totalMarks}</td>
                                    <td className="border border-gray-400 p-3 text-center text-blue-900">
                                         {percentage}%
                                    </td>
                                    <td className="border border-gray-400 p-3 text-center uppercase text-xs tracking-wider">
                                        {percentage >= 40 ? 'Promoted' : 'Retained'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                     </div>

                     {/* Co-Scholastic & Skills */}
                     <div className="mb-12">
                         <h3 className="text-lg font-bold mb-3 uppercase text-blue-900 border-l-4 border-blue-900 pl-3">Part 2: Co-Scholastic & Skills</h3>
                         <div className="grid grid-cols-2 gap-4">
                            {student.skills.map((skill, idx) => (
                                <div key={idx} className="flex justify-between items-center border border-gray-300 p-3 rounded-md bg-white">
                                    <span className="font-semibold text-gray-700">{skill.skill}</span>
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${star <= skill.level ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>

                     {/* Footer Signatures */}
                     <div className="flex justify-between items-end mt-20 pt-8 px-4">
                        <div className="text-center w-1/4">
                            <p className="font-bold text-gray-800">{today}</p>
                            <div className="border-t-2 border-gray-400 mt-1"></div>
                            <p className="text-sm text-gray-600 mt-1">Date</p>
                        </div>
                        <div className="text-center w-1/4">
                            <div className="h-8"></div>
                            <div className="border-t-2 border-gray-400 mt-1"></div>
                            <p className="text-sm text-gray-600 mt-1">Class Teacher</p>
                        </div>
                        <div className="text-center w-1/4">
                            <div className="w-20 h-20 border-2 border-dashed border-gray-300 mx-auto rounded-full flex items-center justify-center text-gray-400 text-xs mb-2">School Seal</div>
                            <div className="border-t-2 border-gray-400 mt-1"></div>
                            <p className="text-sm text-gray-600 mt-1">Principal</p>
                        </div>
                     </div>
                     
                     <div className="mt-12 text-center text-xs text-gray-400 print:hidden">
                        <p>This document is computer generated.</p>
                     </div>
                </div>
            </div>
        </div>
    );
};
