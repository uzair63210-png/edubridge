
import React, { useState } from 'react';
import { Card } from './common/Card';
import { type ClassData, type Student, type Teacher } from '../types';
import { AddTeacherModal } from './AddTeacherModal';
import { CloseIcon, UserCircleIcon } from './icons/Icons';

interface ClassDetailProps {
    className: string;
    classData: ClassData;
    allClasses?: string[]; // All available classes for multi-class assignment
    onSelectStudent: (student: Student) => void;
    onSetAcademicHead?: (className: string, teacherId: string) => void;
    onSelectTeacher?: (teacher: Teacher) => void;
    onAddTeacher?: (teacherName: string) => void;
    onDeleteTeacher?: (teacherId: string) => void;
    onDeleteStudent?: (studentId: string) => void;
    onUpdateTeacherClasses?: (teacherId: string, classes: string[]) => void;
    onUpdateTeacherSubjects?: (teacherId: string, subjects: string[]) => void;
}

// Helper to extract class and division from className (e.g., "6th A" -> {class: "6", division: "A"})
const parseClassName = (fullClassName: string) => {
  const match = fullClassName.match(/^(\d+)\w*\s*([A-Z]?)$/);
  return {
    class: match ? match[1] : fullClassName,
    division: match ? match[2] : ''
  };
};

interface AssignClassesModalProps {
    isOpen: boolean;
    teacher: Teacher | null;
    allClasses: string[];
    onClose: () => void;
    onSubmit: (teacherId: string, classes: string[]) => void;
}

interface AssignSubjectsModalProps {
    isOpen: boolean;
    teacher: Teacher | null;
    onClose: () => void;
    onSubmit: (teacherId: string, subjects: string[]) => void;
}

const AVAILABLE_SUBJECTS = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 'Hindi', 'Physical Education', 'Art', 'Computer Science', 'Social Studies'
];

const AssignSubjectsModal: React.FC<AssignSubjectsModalProps> = ({ isOpen, teacher, onClose, onSubmit }) => {
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(teacher?.subjects || []);

    React.useEffect(() => {
        setSelectedSubjects(teacher?.subjects || []);
    }, [teacher]);

    if (!isOpen || !teacher) return null;

    const handleToggleSubject = (subject: string) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleSubmit = () => {
        onSubmit(teacher.id, selectedSubjects);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Assign Subjects to {teacher.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                    {AVAILABLE_SUBJECTS.map(subject => (
                        <label key={subject} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedSubjects.includes(subject)}
                                onChange={() => handleToggleSubject(subject)}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700 font-medium">{subject}</span>
                        </label>
                    ))}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p>
                        <span className="font-semibold">Selected:</span> {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
                    </p>
                    {selectedSubjects.length > 0 && (
                        <p className="text-blue-600">{selectedSubjects.join(', ')}</p>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

const AssignClassesModal: React.FC<AssignClassesModalProps> = ({ isOpen, teacher, allClasses, onClose, onSubmit }) => {
    const [selectedClasses, setSelectedClasses] = useState<string[]>(teacher?.classesTeaching || []);

    React.useEffect(() => {
        setSelectedClasses(teacher?.classesTeaching || []);
    }, [teacher]);

    if (!isOpen || !teacher) return null;

    const handleToggleClass = (className: string) => {
        setSelectedClasses(prev =>
            prev.includes(className)
                ? prev.filter(c => c !== className)
                : [...prev, className]
        );
    };

    const handleSubmit = () => {
        if (selectedClasses.length === 0) {
            alert('Please select at least one class for this teacher.');
            return;
        }
        onSubmit(teacher.id, selectedClasses);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Assign Classes to {teacher.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                    {allClasses.map(className => (
                        <label key={className} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedClasses.includes(className)}
                                onChange={() => handleToggleClass(className)}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700 font-medium">{className}</span>
                        </label>
                    ))}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p>
                        <span className="font-semibold">Selected:</span> {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}
                    </p>
                    {selectedClasses.length > 0 && (
                        <p className="text-blue-600">{selectedClasses.join(', ')}</p>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ClassDetail: React.FC<ClassDetailProps> = ({ 
  className, 
  classData, 
  allClasses = [],
  onSelectStudent, 
  onSetAcademicHead, 
  onSelectTeacher, 
  onAddTeacher, 
  onDeleteTeacher, 
  onDeleteStudent,
  onUpdateTeacherClasses,
  onUpdateTeacherSubjects 
}) => {
    const [isAddTeacherModalOpen, setAddTeacherModalOpen] = useState(false);
    const [isAssignClassesModalOpen, setAssignClassesModalOpen] = useState(false);
    const [isAssignSubjectsModalOpen, setAssignSubjectsModalOpen] = useState(false);
    const [selectedTeacherForAssign, setSelectedTeacherForAssign] = useState<Teacher | null>(null);
    const academicHead = classData.teachers.find(t => t.id === classData.academicHeadId);
    const { class: classNum, division } = parseClassName(className);

    const handleOpenAssignClassesModal = (teacher: Teacher) => {
        setSelectedTeacherForAssign(teacher);
        setAssignClassesModalOpen(true);
    };

    const handleAssignClasses = (teacherId: string, classes: string[]) => {
        if (onUpdateTeacherClasses) {
            onUpdateTeacherClasses(teacherId, classes);
        }
        setAssignClassesModalOpen(false);
    };

    const handleOpenAssignSubjectsModal = (teacher: Teacher) => {
        setSelectedTeacherForAssign(teacher);
        setAssignSubjectsModalOpen(true);
    };

    const handleAssignSubjects = (teacherId: string, subjects: string[]) => {
        if (onUpdateTeacherSubjects) {
            onUpdateTeacherSubjects(teacherId, subjects);
        }
        setAssignSubjectsModalOpen(false);
    };

    const availableClassesForAssignment = allClasses.length > 0 ? allClasses : [className];

    return (
        <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Class {classNum}</h1>
              {division && <p className="text-gray-600 text-lg">Division: <span className="font-bold text-blue-600">{division}</span></p>}
              <p className="text-gray-500 mt-2">Manage teachers and students for this class.</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Teachers</h2>
                    {onAddTeacher && (
                         <button 
                            onClick={() => setAddTeacherModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow"
                        >
                        + Add Teacher
                        </button>
                    )}
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <label htmlFor="academic-head-select" className="block text-sm font-medium text-gray-700 mb-1">Class Head Teacher</label>
                    {onSetAcademicHead ? (
                         <select
                            id="academic-head-select"
                            value={classData.academicHeadId}
                            onChange={(e) => onSetAcademicHead(className, e.target.value)}
                            className="mt-1 block w-full md:w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="">Select Class Head</option>
                            {classData.teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-lg font-semibold text-blue-800">{academicHead ? academicHead.name : 'Not Assigned'}</p>
                    )}
                     <p className="text-xs text-gray-500 mt-2">The class head is responsible for the overall management and is responsible for sending student addition requests for this division.</p>
                </div>


                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Login Code</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Classes Teaching</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classData.teachers.map(teacher => (
                                <tr key={teacher.id} className={`border-b hover:bg-gray-50 transition-colors ${teacher.id === classData.academicHeadId ? 'bg-blue-50' : ''}`}>
                                    <td className="p-3 font-medium text-gray-800 flex items-center">
                                      {teacher.name}
                                      {teacher.id === classData.academicHeadId && <span className="ml-2 text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">Head</span>}
                                    </td>
                                    <td className="p-3 text-gray-700 font-mono text-sm bg-gray-100 rounded-md">{teacher.loginCode}</td>
                                    <td className="p-3 text-gray-700 text-sm">
                                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                        {teacher.classesTeaching?.length || 0} class{teacher.classesTeaching?.length !== 1 ? 'es' : ''}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right space-x-1 flex flex-wrap justify-end gap-1">
                                        {onUpdateTeacherClasses && (
                                            <button
                                                onClick={() => handleOpenAssignClassesModal(teacher)}
                                                className="bg-purple-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-purple-600 transition-colors whitespace-nowrap"
                                            >
                                                Classes
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleOpenAssignSubjectsModal(teacher)}
                                            className="bg-orange-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
                                        >
                                            Subjects
                                        </button>
                                        {onSelectTeacher && (
                                            <button
                                                onClick={() => onSelectTeacher(teacher)}
                                                className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                                            >
                                                View
                                            </button>
                                        )}
                                        {onDeleteTeacher && (
                                            <button
                                                onClick={() => onDeleteTeacher(teacher.id)}
                                                className="bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200 transition-colors whitespace-nowrap"
                                                aria-label="Delete Teacher"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Students ({classData.students.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Roll No.</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Parent/Student Login Code</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classData.students.length > 0 ? classData.students.map(student => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 flex items-center">
                                        {student.profilePicUrl ? (
                                            <img src={student.profilePicUrl} alt={student.name} className="w-10 h-10 rounded-full mr-4 object-cover"/>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-gray-400">
                                                <UserCircleIcon className="w-6 h-6"/>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800">{student.name}</p>
                                            <p className="text-sm text-gray-500 md:hidden">Roll No: {student.rollNumber}</p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-700 hidden md:table-cell">{student.rollNumber}</td>
                                    <td className="p-3 text-gray-700 hidden lg:table-cell font-mono bg-gray-100 rounded-md">{student.rollNumber}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button 
                                            onClick={() => onSelectStudent(student)} 
                                            className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            View
                                        </button>
                                        {onDeleteStudent && (
                                            <button 
                                                onClick={() => onDeleteStudent(student.id)} 
                                                className="bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                                                aria-label="Delete Student"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-500">
                                        No students have been added to this class yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {onAddTeacher && (
                <AddTeacherModal
                    isOpen={isAddTeacherModalOpen}
                    onClose={() => setAddTeacherModalOpen(false)}
                    onSubmit={(teacherName) => {
                        onAddTeacher(teacherName);
                        setAddTeacherModalOpen(false);
                    }}
                />
            )}

            {onUpdateTeacherClasses && (
                <AssignClassesModal
                    isOpen={isAssignClassesModalOpen}
                    teacher={selectedTeacherForAssign}
                    allClasses={availableClassesForAssignment}
                    onClose={() => {
                        setAssignClassesModalOpen(false);
                        setSelectedTeacherForAssign(null);
                    }}
                    onSubmit={handleAssignClasses}
                />
            )}

            <AssignSubjectsModal
                isOpen={isAssignSubjectsModalOpen}
                teacher={selectedTeacherForAssign}
                onClose={() => {
                    setAssignSubjectsModalOpen(false);
                    setSelectedTeacherForAssign(null);
                }}
                onSubmit={handleAssignSubjects}
            />
        </div>
    );
};
