
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { UserRole, View, type Student, type Teacher, type DigitalDocument, type Score, type Skill } from '../types';
import { Card } from './common/Card';
import { StudentSubNav } from './StudentSubNav';
import { SkillsView } from './SkillsView';
import { CloseIcon, UserCircleIcon, DocsIcon } from './icons/Icons';
import { ReportCard } from './ReportCard';

interface StudentDetailProps {
  student: Student;
  userRole: UserRole;
  view: View;
  setView: (view: View) => void;
  onUpdateAttendance?: (newPresentCount: number) => void;
  onUpdateScore?: (studentId: string, subject: string, newScore: number) => void;
  onUpdatePracticeScore?: (studentId: string, subject: string, newScore: number) => void;
  onUpdateSkills?: (studentId: string, newSkills: Skill[]) => void;
  loggedInTeacher?: Teacher | null;
  onAddDocument?: (docData: Omit<DigitalDocument, 'id' | 'date' | 'uploadedBy' | 'url'>) => void;
  onDeleteDocument?: (docId: string) => void;
  onUpdateProfilePic?: (studentId: string, newUrl: string) => void;
  onBackToList?: () => void;
}

const InfoItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);

const AddDocumentForm: React.FC<{ onAdd: (docData: Omit<DigitalDocument, 'id' | 'date' | 'uploadedBy' | 'url'>) => void; onCancel: () => void; }> = ({ onAdd, onCancel }) => {
    const [title, setTitle] = useState('');
    const [docType, setDocType] = useState<'Marksheet' | 'Aadhaar Card' | 'Birth Certificate' | 'Other'>('Other');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd({ title, documentType: docType });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-3">
            <h3 className="font-semibold text-gray-700">Upload New Document</h3>
            <div>
                <label htmlFor="doc-title" className="text-sm font-medium text-gray-600">Document Title</label>
                <input id="doc-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Mid-Term Marksheet" required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label htmlFor="doc-type" className="text-sm font-medium text-gray-600">Document Type</label>
                <select id="doc-type" value={docType} onChange={e => setDocType(e.target.value as any)} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                    <option>Marksheet</option>
                    <option>Aadhaar Card</option>
                    <option>Birth Certificate</option>
                    <option>Other</option>
                </select>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-white px-3 py-1.5 text-sm rounded-md border">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700">Add Document</button>
            </div>
        </form>
    )
}

const PracticeScoresCard: React.FC<{
    student: Student;
    onUpdate: (subject: string, newScore: number) => void;
}> = ({ student, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedScores, setEditedScores] = useState<Score[]>(student.practiceScores || []);

    useEffect(() => {
        setEditedScores(student.practiceScores || []);
    }, [student.practiceScores]);

    const handleScoreChange = (subject: string, newScore: number) => {
        if (newScore > 100) newScore = 100;
        if (newScore < 0) newScore = 0;
        setEditedScores(prev => prev.map(s => s.subject === subject ? { ...s, score: newScore } : s));
    };

    const handleSaveChanges = () => {
        editedScores.forEach(editedScore => {
            const originalScore = student.practiceScores?.find(s => s.subject === editedScore.subject);
            if (!originalScore || originalScore.score !== editedScore.score) {
                onUpdate(editedScore.subject, editedScore.score);
            }
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedScores(student.practiceScores || []);
        setIsEditing(false);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Practice Scores</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                        Edit Scores
                    </button>
                )}
            </div>
            <p className="text-sm text-gray-500 mb-4">This section is for your personal tracking. You can update scores from practice tests here.</p>
            <table className="w-full text-left">
                <tbody>
                    {(isEditing ? editedScores : student.practiceScores)?.map(score => (
                        <tr key={score.subject} className="border-b">
                            <td className="p-3 font-medium text-gray-800">{score.subject}</td>
                            <td className="p-3 text-gray-700">
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={score.score}
                                        onChange={(e) => handleScoreChange(score.subject, parseInt(e.target.value, 10) || 0)}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <span>{score.score} / 100</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditing && (
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={handleCancelEdit} className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm">Cancel</button>
                    <button onClick={handleSaveChanges} className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm">Save Changes</button>
                </div>
            )}
        </Card>
    );
};

export const StudentDetail: React.FC<StudentDetailProps> = ({ student, userRole, view, setView, onUpdateAttendance, onUpdateScore, onUpdatePracticeScore, onUpdateSkills, loggedInTeacher, onAddDocument, onDeleteDocument, onUpdateProfilePic, onBackToList }) => {
    const attendancePercentage = student.attendance.total > 0 ? Math.round((student.attendance.present / student.attendance.total) * 100) : 0;
    const canSeeFullPII = userRole === UserRole.Admin || userRole === UserRole.Parent || userRole === UserRole.Student;
    const showLoginCode = userRole === UserRole.Admin || userRole === UserRole.Teacher || userRole === UserRole.Student || userRole === UserRole.Parent;
    const [isEditingScores, setIsEditingScores] = useState(false);
    const [editedScores, setEditedScores] = useState(student.scores);
    const [isAddingDocument, setIsAddingDocument] = useState(false);
    const [isEditingPic, setIsEditingPic] = useState(false);
    const [newPicUrl, setNewPicUrl] = useState(student.profilePicUrl);
    const [showReportCard, setShowReportCard] = useState(false);

    // Skills Editing State
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [editedSkills, setEditedSkills] = useState<Skill[]>(student.skills);


    // Calc average for parent view
    const averageScore = student.scores.length > 0 
        ? Math.round(student.scores.reduce((acc, curr) => acc + curr.score, 0) / student.scores.length)
        : 0;
    
    const topSkill = student.skills.reduce((prev, current) => (prev.level > current.level) ? prev : current, {skill: '-', level: 0});


    useEffect(() => {
        setEditedScores(student.scores);
        setEditedSkills(student.skills);
        setIsEditingScores(false); 
        setIsAddingDocument(false);
        setIsEditingPic(false);
        setIsEditingSkills(false);
        setNewPicUrl(student.profilePicUrl);
    }, [student]);

    const handleScoreChange = (subject: string, newScore: number) => {
        if (newScore > 100) newScore = 100;
        if (newScore < 0) newScore = 0;
        setEditedScores(prev => prev.map(s => s.subject === subject ? { ...s, score: newScore } : s));
    };

    const handleSaveChanges = () => {
        if (!onUpdateScore) return;
        editedScores.forEach(editedScore => {
            const originalScore = student.scores.find(s => s.subject === editedScore.subject);
            if (originalScore && originalScore.score !== editedScore.score) {
                onUpdateScore(student.id, editedScore.subject, editedScore.score);
            }
        });
        setIsEditingScores(false);
    };

    const handleCancelEdit = () => {
        setEditedScores(student.scores);
        setIsEditingScores(false);
    };
    
    const handleSavePic = () => {
        if (onUpdateProfilePic && newPicUrl.trim()) {
            onUpdateProfilePic(student.id, newPicUrl.trim());
            setIsEditingPic(false);
        }
    };
    
    const handleSkillChange = (skillName: string, newLevel: number) => {
        setEditedSkills(prev => prev.map(s => s.skill === skillName ? { ...s, level: newLevel } : s));
    };

    const handleSaveSkills = () => {
        if (onUpdateSkills) {
            onUpdateSkills(student.id, editedSkills);
        }
        setIsEditingSkills(false);
    };

    const handleCancelEditSkills = () => {
        setEditedSkills(student.skills);
        setIsEditingSkills(false);
    };

    // Special Consolidated Layout for Parents
    if (userRole === UserRole.Parent) {
        return (
            <div className="space-y-6">
                <StudentSubNav view={view} setView={setView} />
                
                {/* Hero Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
                    <div className="px-6 pb-6 flex flex-col md:flex-row items-center md:items-end -mt-12">
                        <div className="relative z-10">
                             {student.profilePicUrl ? (
                                <img src={student.profilePicUrl} alt={student.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200" />
                             ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-400">
                                    <UserCircleIcon className="w-20 h-20"/>
                                </div>
                             )}
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
                             <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                             <p className="text-gray-600 font-medium">Class {student.class} | Roll No: {student.rollNumber}</p>
                             <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
                                 <span>Guardian: {student.guardianName}</span>
                                 <span>•</span>
                                 <span>{student.contact}</span>
                             </div>
                        </div>
                        <div className="mt-6 md:mt-0 md:mb-2">
                             <button 
                                onClick={() => setShowReportCard(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                             >
                                <DocsIcon className="w-5 h-5" />
                                Download Progress Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="flex items-center p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
                            <div className="flex items-baseline">
                                <p className="text-2xl font-bold text-gray-800">{attendancePercentage}%</p>
                                <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                    {attendancePercentage >= 75 ? 'Excellent' : attendancePercentage >= 60 ? 'Good' : 'Low'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="flex items-center p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Score</p>
                             <div className="flex items-baseline">
                                <p className="text-2xl font-bold text-gray-800">{averageScore}%</p>
                                <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                    {averageScore >= 80 ? 'Grade A' : averageScore >= 60 ? 'Grade B' : 'Grade C'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="flex items-center p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Top Skill</p>
                             <div className="flex items-baseline">
                                <p className="text-lg font-bold text-gray-800 truncate">{topSkill.skill}</p>
                                <span className="ml-2 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                    {topSkill.level}/5
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Academic Performance */}
                    <Card className="lg:col-span-2">
                         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="bg-gray-100 p-2 rounded-full mr-3"><DocsIcon className="w-5 h-5 text-gray-600"/></span>
                            Academic Performance
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-gray-600">Subject</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600">Score</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600">Grade</th>
                                        <th className="p-4 text-sm font-semibold text-gray-600">Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.scores.map(score => {
                                         let grade = '';
                                         if (score.score >= 90) grade = 'A+';
                                         else if (score.score >= 80) grade = 'A';
                                         else if (score.score >= 70) grade = 'B';
                                         else if (score.score >= 60) grade = 'C';
                                         else if (score.score >= 50) grade = 'D';
                                         else grade = 'E';

                                         return (
                                            <tr key={score.subject} className="border-b hover:bg-gray-50">
                                                <td className="p-4 font-medium text-gray-800">{score.subject}</td>
                                                <td className="p-4 font-bold text-gray-700">{score.score}/100</td>
                                                <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{grade}</span></td>
                                                <td className="p-4 w-1/3">
                                                     <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${score.score}%` }}></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Skills Radar */}
                    <Card className="lg:col-span-1">
                         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="bg-gray-100 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                            </span>
                            Skills Profile
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={student.skills}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                    <Radar name={student.name} dataKey="level" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                
                {/* Modal for Report Card */}
                {showReportCard && <ReportCard student={student} onClose={() => setShowReportCard(false)} />}
            </div>
        );
    }

    // Default View for Teachers/Admins/Students
    return (
        <div className="space-y-6">
            {userRole === UserRole.Teacher && onBackToList && (
                 <button 
                    onClick={onBackToList}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Student List
                </button>
            )}
            {userRole !== UserRole.Student && <StudentSubNav view={view} setView={setView} />}
            
            {/* Skills View */}
            {view === View.Skills && (
                <SkillsView
                    student={student}
                    userRole={userRole}
                    onUpdateSkills={onUpdateSkills}
                    loggedInTeacher={loggedInTeacher}
                />
            )}
            
            {/* Standard Header for Non-Parent roles - Hidden when showing Skills View */}
            {view !== View.Skills && (
                <div className="flex items-center space-x-4">
                    <div className="relative group w-24 h-24">
                        {student.profilePicUrl ? (
                            <img src={student.profilePicUrl} alt={student.name} className="w-full h-full rounded-full border-4 border-white shadow-md object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-gray-400">
                                <UserCircleIcon className="w-16 h-16"/>
                            </div>
                        )}
                        
                        {onUpdateProfilePic && (
                            <button 
                                onClick={() => setIsEditingPic(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
                        <p className="text-gray-500">Class {student.class} | Roll No: {student.rollNumber}</p>
                    </div>
                </div>
            )}
            
            {isEditingPic && (
                <Card className="p-4 bg-gray-50 border border-gray-200">
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
                </Card>
            )}

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Guardian Name" value={student.guardianName} />
                     {canSeeFullPII ? (
                        <>
                            <InfoItem label="Contact" value={student.contact} />
                            <InfoItem label="Address" value={student.address} />
                        </>
                    ) : (
                        <>
                            <InfoItem label="Contact" value="Restricted" />
                            <InfoItem label="Address" value="Restricted" />
                        </>
                    )}
                </div>
                 {/* Custom display for Teacher */}
                {userRole === UserRole.Teacher ? (
                    <div className="mt-4 pt-4 border-t border-gray-200 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-6">
                            <InfoItem label="Roll Number" value={student.rollNumber.toString()} />
                            <div className="border-l-2 border-blue-200 pl-6">
                                 <p className="text-sm text-gray-500">Student/Parent Login Code</p>
                                 <p className="font-bold text-lg text-blue-700 font-mono tracking-wider">{student.rollNumber.toString()}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Please provide this login code to the student and their parent. It is the same as the student's roll number.</p>
                    </div>
                ) : (
                    /* Existing display for other roles */
                    showLoginCode && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <InfoItem label="Parent / Student Login Code" value={student.rollNumber.toString()} />
                            <p className="text-xs text-gray-400 mt-1">This code is used by the student and their parents to log in.</p>
                        </div>
                    )
                )}
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance</h2>
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-green-500"
                                strokeDasharray={`${attendancePercentage}, 100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800">{attendancePercentage}%</span>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-3">{student.attendance.present} / {student.attendance.total} days present</p>
                </Card>

                <Card className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Skills Overview</h2>
                        {(userRole === UserRole.Teacher || userRole === UserRole.Admin) && onUpdateSkills && !isEditingSkills && (
                            <button onClick={() => setIsEditingSkills(true)} className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded-md transition-colors">Edit Skills</button>
                        )}
                    </div>
                    
                    {isEditingSkills ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {editedSkills.map(skill => (
                                    <div key={skill.skill} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="font-medium text-gray-700">{skill.skill}</label>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{skill.level}/5</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="5" 
                                            step="1"
                                            value={skill.level} 
                                            onChange={(e) => handleSkillChange(skill.skill, parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                            <span>5</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                <button onClick={handleCancelEditSkills} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                                <button onClick={handleSaveSkills} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Skills</button>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={student.skills}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="skill" />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                <Radar name={student.name} dataKey="level" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Academic Scores</h2>
                    {userRole === UserRole.Teacher && onUpdateScore && !isEditingScores && (
                        <button onClick={() => setIsEditingScores(true)} className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                            Edit Scores
                        </button>
                    )}
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Subject</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Score</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(isEditingScores ? editedScores : student.scores).map(score => {
                                const canEdit = isEditingScores && loggedInTeacher?.subjects.includes(score.subject);
                                const scoreRemark = score.score >= 90 ? 'Excellent' : score.score >= 75 ? 'Good' : score.score >= 50 ? 'Satisfactory' : 'Needs Improvement';
                                return (
                                <tr key={score.subject} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-800">{score.subject}</td>
                                    <td className="p-3 text-gray-700">
                                        {canEdit ? (
                                            <input
                                                type="number"
                                                value={score.score}
                                                onChange={(e) => handleScoreChange(score.subject, parseInt(e.target.value, 10) || 0)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                max="100"
                                                min="0"
                                            />
                                        ) : (
                                            <span>{score.score} / 100</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-gray-700 hidden md:table-cell">{scoreRemark}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                {isEditingScores && (
                    <div className="flex justify-end space-x-3 mt-4">
                        <button onClick={handleCancelEdit} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveChanges} className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">Save Changes</button>
                    </div>
                )}
            </Card>

            {userRole === UserRole.Student && onUpdatePracticeScore && (
                 <PracticeScoresCard
                    student={student}
                    onUpdate={(subject, newScore) => onUpdatePracticeScore(student.id, subject, newScore)}
                />
            )}

            {userRole === UserRole.Admin && onAddDocument && onDeleteDocument && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Official Documents</h2>
                        {!isAddingDocument && (
                            <button onClick={() => setIsAddingDocument(true)} className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600">
                               + Upload Document
                            </button>
                        )}
                    </div>
                    {isAddingDocument && <AddDocumentForm onAdd={(doc) => { onAddDocument(doc); setIsAddingDocument(false); }} onCancel={() => setIsAddingDocument(false)} />}
                    <ul className="mt-4 space-y-2">
                        {student.digitalDocuments.length > 0 ? student.digitalDocuments.map(doc => (
                            <li key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                                <div>
                                    <p className="font-medium text-gray-800">{doc.title}</p>
                                    <p className="text-sm text-gray-500">{doc.documentType} - Uploaded on {new Date(doc.date).toLocaleDateString()}</p>
                                </div>
                                <div className="space-x-2">
                                     <a href={doc.url} download className="text-blue-600 hover:underline text-sm font-medium">Download</a>
                                     <button onClick={() => onDeleteDocument(doc.id)} className="text-red-500 hover:text-red-700"><CloseIcon className="w-4 h-4" /></button>
                                </div>
                            </li>
                        )) : <p className="text-center text-gray-500 py-4">No official documents uploaded.</p>}
                    </ul>
                </Card>
            )}

            {userRole === UserRole.Teacher && onUpdateAttendance && (
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Management</h2>
                    <p className="text-sm text-gray-600 mb-4">Update the student's attendance record. Current days present: <strong>{student.attendance.present}</strong> out of {student.attendance.total}.</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => onUpdateAttendance(student.attendance.present + 1)}
                            disabled={student.attendance.present >= student.attendance.total}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            +1 Present Day
                        </button>
                        <button
                            onClick={() => onUpdateAttendance(student.attendance.present - 1)}
                            disabled={student.attendance.present <= 0}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            -1 Present Day
                        </button>
                    </div>
                </Card>
            )}
            
            {/* Modal for Report Card (also for student view if they want it) */}
            {showReportCard && <ReportCard student={student} onClose={() => setShowReportCard(false)} />}
        </div>
    );
};
