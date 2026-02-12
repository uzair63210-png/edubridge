
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentDetail } from './components/StudentDetail';
import { DigitalDocs } from './components/DigitalDocs';
import { FeePayment } from './components/FeePayment';
import { Header } from './components/Header';
import { Spinner } from './components/common/Spinner';
import { Login } from './components/Login';
import { ClassDetail } from './components/ClassDetail';
import { Requests } from './components/Requests';
import { AddStudentModal } from './components/AddStudentModal';
import { TeacherDetail } from './components/TeacherDetail';
import { AcademicsView } from './components/AcademicsView';
import { AdminDashboard } from './components/AdminDashboard';
import { NoticeBoard } from './components/NoticeBoard';
import { EContentView } from './components/EContentView';
import { ManageEContentView } from './components/ManageEContentView';
import { AttendanceView } from './components/AttendanceView';
import { TeacherStudentSelection } from './components/TeacherStudentSelection';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { View, UserRole, type Student, type SchoolData, type Teacher, type StudentRequest, type Notice, type DigitalDocument, type EContentItem, type Skill } from './types';
import { getInitialSchoolData, saveSchoolData } from './services/geminiService';

const MASTER_PASSWORD = '1234'; // Hardcoded master password

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loggedInTeacher, setLoggedInTeacher] = useState<Teacher | null>(null);
  const [view, setView] = useState<View>(View.Dashboard);
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [teacherClass, setTeacherClass] = useState<string | null>(null); // For logged in teacher
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  
  // Admin Profile Pic State (Local Storage)
  const [adminProfilePic, setAdminProfilePic] = useState<string>(localStorage.getItem('adminProfilePic') || '');

  useEffect(() => {
    const initData = async () => {
        setIsLoading(true);
        const data = await getInitialSchoolData();
        setSchoolData(data);
        setNotices([
            { id: 'notice-1', title: 'Holiday Notice', content: 'The school will be closed on account of Guru Nanak Jayanti.', date: new Date('2025-11-04').toISOString(), targetAudience: [UserRole.Student, UserRole.Teacher, UserRole.Parent], issuedBy: 'Admin' },
            { id: 'notice-2', title: 'Scholarship Notice A.Y 2025-26', content: 'Students can apply for the new scholarship program starting next week.', date: new Date('2025-10-29').toISOString(), targetAudience: [UserRole.Student, UserRole.Parent], issuedBy: 'Admin' },
            { id: 'notice-3', title: 'Diwali Festival Notice', content: 'Happy Diwali! School will remain closed for the festival.', date: new Date('2025-10-16').toISOString(), targetAudience: [UserRole.Student, UserRole.Teacher, UserRole.Parent], issuedBy: 'Admin' },
            { id: 'notice-4', title: 'Staff Meeting', content: 'A mandatory staff meeting will be held on Friday.', date: new Date('2025-10-15').toISOString(), targetAudience: [UserRole.Teacher], issuedBy: 'Admin' },
        ]);
        setIsLoading(false);
    };
    initData();
  }, []);

  // Persist data whenever it changes
  useEffect(() => {
      if (schoolData) {
          saveSchoolData(schoolData);
      }
  }, [schoolData]);

  const allStudents = useMemo(() => schoolData ? Object.keys(schoolData).flatMap(key => schoolData[key].students) : [], [schoolData]);

  const attemptLogin = (role: UserRole, code?: string, name?: string, password?: string): boolean => {
    if (!schoolData) return false;
    
    // Master password check for fallback
    const isMasterPassword = password === MASTER_PASSWORD;

    if (role === UserRole.Admin) {
        if (isMasterPassword) {
            setUserRole(UserRole.Admin);
            setView(View.Dashboard);
            return true;
        }
        return false;
    }

    if (role === UserRole.Teacher) {
        if (!code) return false;
        for (const className in schoolData) {
            const teacher = schoolData[className].teachers.find(t => t.loginCode === code.trim());
            // Check specific password OR master password
            if (teacher) {
                const teacherPassword = teacher.password || '1234';
                if (password === teacherPassword || isMasterPassword) {
                    setUserRole(UserRole.Teacher);
                    setLoggedInTeacher(teacher);
                    setTeacherClass(className);
                    setView(View.Dashboard);
                    return true;
                }
            }
        }
        return false;
    }

    if (role === UserRole.Student || role === UserRole.Parent) {
        if (!code) return false;
        const student = allStudents.find(s => s.rollNumber.toString() === code.trim());
        if (student) {
            if (role === UserRole.Parent) {
                // Guardian name must be provided and must match (case-insensitive)
                if (!name || student.guardianName.trim().toLowerCase() !== name.trim().toLowerCase()) {
                    return false;
                }
            }
            
            // Password check
            const studentPassword = student.password || '1234';
            if (password === studentPassword || isMasterPassword) {
                setUserRole(role);
                setSelectedStudent(student);
                setView(View.Dashboard);
                return true;
            }
        }
        return false;
    }
    return false;
  };
  
  const handleLogout = () => {
    setUserRole(null);
    setSelectedStudent(null);
    setSelectedTeacher(null);
    setSelectedClass(null);
    setTeacherClass(null);
    setLoggedInTeacher(null);
    setView(View.Dashboard);
    setSidebarOpen(false);
  };

  const handleUpdateAdminPic = (newUrl: string) => {
    setAdminProfilePic(newUrl);
    localStorage.setItem('adminProfilePic', newUrl);
  };

  const handleChangePassword = (newPassword: string) => {
      if (!schoolData) return;
      
      if (userRole === UserRole.Teacher && loggedInTeacher) {
          setSchoolData(prev => {
              if (!prev) return null;
              const newSchoolData = { ...prev };
              for (const className in newSchoolData) {
                  const teachers = newSchoolData[className].teachers;
                  const teacherIndex = teachers.findIndex(t => t.id === loggedInTeacher.id);
                  if (teacherIndex !== -1) {
                      const updatedTeachers = [...teachers];
                      updatedTeachers[teacherIndex] = { ...teachers[teacherIndex], password: newPassword };
                      newSchoolData[className] = { ...newSchoolData[className], teachers: updatedTeachers };
                      // Update local state as well
                      setLoggedInTeacher(updatedTeachers[teacherIndex]);
                      break;
                  }
              }
              return newSchoolData;
          });
      } else if ((userRole === UserRole.Student || userRole === UserRole.Parent) && selectedStudent) {
           setSchoolData(prev => {
              if (!prev) return null;
              const newSchoolData = { ...prev };
              for (const className in newSchoolData) {
                  const students = newSchoolData[className].students;
                  const studentIndex = students.findIndex(s => s.id === selectedStudent.id);
                  if (studentIndex !== -1) {
                      const updatedStudents = [...students];
                      updatedStudents[studentIndex] = { ...students[studentIndex], password: newPassword };
                      newSchoolData[className] = { ...newSchoolData[className], students: updatedStudents };
                      // Update local state
                      setSelectedStudent(updatedStudents[studentIndex]);
                      break;
                  }
              }
              return newSchoolData;
           });
      } else if (userRole === UserRole.Admin) {
          alert("Admin password cannot be changed in this demo.");
      }
  };

  const handleAddStudentRequest = (studentData: Omit<Student, 'id' | 'profilePicUrl'>) => {
    if (!loggedInTeacher) return;
    const newRequest: StudentRequest = {
        id: `req-${Date.now()}`,
        student: { ...studentData, digitalDocuments: [], password: '1234' },
        teacherName: loggedInTeacher.name,
        status: 'pending'
    };
    setStudentRequests(prev => [...prev, newRequest]);
  };

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
      if (!schoolData || !schoolData[studentData.class]) return;
      
      const newStudent: Student = {
          ...studentData,
          id: `stu-${Date.now()}`,
          profilePicUrl: studentData.profilePicUrl || '',
          password: '1234',
          digitalDocuments: [],
      };

      setSchoolData(prev => {
          if (!prev) return null;
          const updatedClassData = {
              ...prev[studentData.class],
              students: [...prev[studentData.class].students, newStudent]
          };
          return { ...prev, [studentData.class]: updatedClassData };
      });
  };
  
  const handleDeleteStudent = (className: string, studentId: string) => {
      if (!window.confirm("Are you sure you want to remove this student? This action cannot be undone.")) return;
      
      setSchoolData(prev => {
          if (!prev || !prev[className]) return prev;
          const updatedStudents = prev[className].students.filter(s => s.id !== studentId);
          return {
              ...prev,
              [className]: {
                  ...prev[className],
                  students: updatedStudents
              }
          };
      });
      if (selectedStudent?.id === studentId) {
          setSelectedStudent(null);
          setView(View.Classes);
      }
  };

  const handleAddTeacher = (className: string, teacherName: string) => {
    if (!schoolData || !schoolData[className]) return;

    const lastName = teacherName.split(' ').pop()?.toUpperCase() || 'NEW';
    const classIdentifier = className.replace(/\D/g, ''); // "6th" -> "6"
    const loginCode = `T-${lastName}${classIdentifier}`;
    const newId = `T-${Date.now()}`;

    const newTeacher: Teacher = {
        id: newId,
        name: teacherName,
        loginCode: loginCode,
        password: '1234',
        subjects: [],
        profilePicUrl: '',
        attendance: { total: 180, present: 180 },
        classesTaken: { weekly: 0, total: 0 },
        classesTeaching: [className], // Initialize with current class
        headOfClass: null // Not head of any class by default
    };

    setSchoolData(prev => {
        if (!prev) return null;
        const updatedTeachers = [...prev[className].teachers, newTeacher];
        const updatedClassData = {
            ...prev[className],
            teachers: updatedTeachers
        };
        return { ...prev, [className]: updatedClassData };
    });
  };
  
  const handleDeleteTeacher = (className: string, teacherId: string) => {
      if (!window.confirm("Are you sure you want to remove this teacher?")) return;

      setSchoolData(prev => {
          if (!prev || !prev[className]) return prev;
          const updatedTeachers = prev[className].teachers.filter(t => t.id !== teacherId);
           // If we deleted the academic head, unset it or pick the first available
          let newAcademicHeadId = prev[className].academicHeadId;
          if (newAcademicHeadId === teacherId) {
             newAcademicHeadId = updatedTeachers.length > 0 ? updatedTeachers[0].id : '';
          }

          return {
              ...prev,
              [className]: {
                  ...prev[className],
                  teachers: updatedTeachers,
                  academicHeadId: newAcademicHeadId
              }
          };
      });
      if (selectedTeacher?.id === teacherId) {
          setSelectedTeacher(null);
      }
  };

  const handleApproveRequest = (requestId: string) => {
      const request = studentRequests.find(r => r.id === requestId);
      if (request) {
          // Provide default profile pic if missing from request (request type omits it)
          const studentToAdd = { 
              ...request.student, 
              profilePicUrl: '' 
          };
          handleAddStudent(studentToAdd);
          setStudentRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
      }
  };

  const handleDenyRequest = (requestId: string) => {
      setStudentRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'denied' } : r));
  };

  const handleSetAcademicHead = (className: string, teacherId: string) => {
    setSchoolData(prev => {
        if (!prev || !prev[className]) return prev;
        
        // Check if this teacher is already head of another class
        let isAlreadyHeadOfAnother = false;
        let otherHeadClass = '';
        for (const cName in prev) {
            if (cName !== className && prev[cName].academicHeadId === teacherId) {
                isAlreadyHeadOfAnother = true;
                otherHeadClass = cName;
                break;
            }
        }
        
        if (isAlreadyHeadOfAnother) {
            alert(`This teacher is already the head of ${otherHeadClass}. A teacher can only be head of one class.`);
            return prev;
        }
        
        // Update the teacher's headOfClass field in all classes
        const newSchoolData = { ...prev };
        for (const cName in newSchoolData) {
            const updatedTeachers = newSchoolData[cName].teachers.map(t => ({
                ...t,
                headOfClass: t.id === teacherId ? className : (t.headOfClass === className ? null : t.headOfClass)
            }));
            newSchoolData[cName] = { ...newSchoolData[cName], teachers: updatedTeachers };
        }
        
        // Set as academic head for this class
        newSchoolData[className] = {
            ...newSchoolData[className],
            academicHeadId: teacherId
        };
        
        return newSchoolData;
    });
  };

  const handleUpdateTeacherClasses = (teacherId: string, newClasses: string[]) => {
    setSchoolData(prev => {
        if (!prev) return null;
        
        // Get the teacher from any class they're currently in
        let teacher: Teacher | null = null;
        let currentClassName = '';
        for (const className in prev) {
            const t = prev[className].teachers.find(t => t.id === teacherId);
            if (t) {
                teacher = t;
                currentClassName = className;
                break;
            }
        }
        
        if (!teacher) return prev;
        
        // Update the teacher's classesTeaching array
        const updatedTeacher = {
            ...teacher,
            classesTeaching: newClasses
        };
        
        // Build new school data
        const newSchoolData = { ...prev };
        
        // Remove teacher from old classes (except those they're still teaching)
        for (const className in newSchoolData) {
            const shouldKeepTeacher = newClasses.includes(className);
            if (shouldKeepTeacher) {
                // Update the teacher in this class with new classesTeaching array
                const updatedTeachers = newSchoolData[className].teachers.map(t =>
                    t.id === teacherId ? updatedTeacher : t
                );
                newSchoolData[className] = { ...newSchoolData[className], teachers: updatedTeachers };
            } else if (!shouldKeepTeacher && newSchoolData[className].teachers.some(t => t.id === teacherId)) {
                // Remove teacher from this class
                const updatedTeachers = newSchoolData[className].teachers.filter(t => t.id !== teacherId);
                // If this teacher was the head, clear the academicHeadId
                const newAcademicHeadId = newSchoolData[className].academicHeadId === teacherId 
                    ? (updatedTeachers.length > 0 ? updatedTeachers[0].id : '')
                    : newSchoolData[className].academicHeadId;
                newSchoolData[className] = { 
                    ...newSchoolData[className], 
                    teachers: updatedTeachers,
                    academicHeadId: newAcademicHeadId
                };
            }
        }
        
        // Add teacher to new classes
        for (const className of newClasses) {
            if (!newSchoolData[className]) continue;
            
            // Only add if not already there
            if (!newSchoolData[className].teachers.some(t => t.id === teacherId)) {
                newSchoolData[className] = {
                    ...newSchoolData[className],
                    teachers: [...newSchoolData[className].teachers, updatedTeacher]
                };
            }
        }
        
        return newSchoolData;
    });
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        for (const className in newSchoolData) {
            const classData = newSchoolData[className];
            const teacherIndex = classData.teachers.findIndex(t => t.id === updatedTeacher.id);
            if (teacherIndex !== -1) {
                const updatedTeachers = [...classData.teachers];
                updatedTeachers[teacherIndex] = updatedTeacher;
                newSchoolData[className] = { ...classData, teachers: updatedTeachers };
                break;
            }
        }
        return newSchoolData;
    });
    setSelectedTeacher(updatedTeacher);
  };

  const handleUpdateTeacherSubjects = (teacherId: string, subjects: string[]) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        for (const className in newSchoolData) {
            const classData = newSchoolData[className];
            const teacherIndex = classData.teachers.findIndex(t => t.id === teacherId);
            if (teacherIndex !== -1) {
                const updatedTeachers = [...classData.teachers];
                updatedTeachers[teacherIndex] = { ...updatedTeachers[teacherIndex], subjects };
                newSchoolData[className] = { ...classData, teachers: updatedTeachers };
            }
        }
        if (selectedTeacher?.id === teacherId) {
            setSelectedTeacher({ ...selectedTeacher, subjects });
        }
        return newSchoolData;
    });
  };

  const handleUpdateStudentScore = (studentId: string, subject: string, newScore: number) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        let studentFound = false;
        for (const className in newSchoolData) {
            const classData = newSchoolData[className];
            const studentIndex = classData.students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...classData.students];
                const studentToUpdate = updatedStudents[studentIndex];
                const scoreIndex = studentToUpdate.scores.findIndex(sc => sc.subject === subject);
                
                const updatedScores = [...studentToUpdate.scores];
                if (scoreIndex !== -1) {
                    updatedScores[scoreIndex] = { ...updatedScores[scoreIndex], score: newScore };
                } else {
                    updatedScores.push({ subject, score: newScore });
                }

                const updatedStudent = {
                    ...studentToUpdate,
                    scores: updatedScores
                };

                updatedStudents[studentIndex] = updatedStudent;
                newSchoolData[className] = { ...classData, students: updatedStudents };
                
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(updatedStudent);
                }
                studentFound = true;
                break;
            }
        }
        return studentFound ? newSchoolData : prev;
    });
  };
  
  const handleUpdateStudentPracticeScore = (studentId: string, subject: string, newScore: number) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        for (const className in newSchoolData) {
            const studentIndex = newSchoolData[className].students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...newSchoolData[className].students];
                const studentToUpdate = { ...updatedStudents[studentIndex] };
                
                let practiceScores = studentToUpdate.practiceScores ? [...studentToUpdate.practiceScores] : [];
                const scoreIndex = practiceScores.findIndex(sc => sc.subject === subject);

                if (scoreIndex !== -1) {
                    practiceScores[scoreIndex] = { ...practiceScores[scoreIndex], score: newScore };
                } else {
                    practiceScores.push({ subject, score: newScore });
                }

                studentToUpdate.practiceScores = practiceScores;
                updatedStudents[studentIndex] = studentToUpdate;
                newSchoolData[className].students = updatedStudents;
                
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(studentToUpdate);
                }
                return newSchoolData;
            }
        }
        return prev;
    });
  };

  const handleUpdateStudentAttendance = (studentId: string, newPresentCount: number) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        let studentFound = false;
        for (const className in newSchoolData) {
            const classData = newSchoolData[className];
            const studentIndex = classData.students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...classData.students];
                const studentToUpdate = updatedStudents[studentIndex];
                
                if (newPresentCount > studentToUpdate.attendance.total) newPresentCount = studentToUpdate.attendance.total;
                if (newPresentCount < 0) newPresentCount = 0;

                const updatedStudent = {
                    ...studentToUpdate,
                    attendance: { ...studentToUpdate.attendance, present: newPresentCount }
                };
                updatedStudents[studentIndex] = updatedStudent;
                newSchoolData[className] = { ...classData, students: updatedStudents };
                
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(updatedStudent);
                }
                studentFound = true;
                break;
            }
        }
        return studentFound ? newSchoolData : prev;
    });
  };
  
  const handleUpdateStudentSkills = (studentId: string, newSkills: Skill[]) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        let studentFound = false;
        for (const className in newSchoolData) {
            const classData = newSchoolData[className];
            const studentIndex = classData.students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...classData.students];
                updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], skills: newSkills };
                newSchoolData[className] = { ...classData, students: updatedStudents };
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(updatedStudents[studentIndex]);
                }
                studentFound = true;
                break;
            }
        }
        return studentFound ? newSchoolData : prev;
    });
  };
  
  const handleUpdateStudentProfilePic = (studentId: string, newUrl: string) => {
      setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        for (const className in newSchoolData) {
            const classData = newSchoolData[className];
            const studentIndex = classData.students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...classData.students];
                updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], profilePicUrl: newUrl };
                newSchoolData[className] = { ...classData, students: updatedStudents };
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(updatedStudents[studentIndex]);
                }
                return newSchoolData;
            }
        }
        return prev;
    });
  };

  const handleFeePayment = (studentId: string) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        for (const className in newSchoolData) {
            const studentIndex = newSchoolData[className].students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...newSchoolData[className].students];
                const studentToUpdate = { ...updatedStudents[studentIndex] };
                studentToUpdate.fees = studentToUpdate.fees.map(fee => fee.status === 'Due' ? { ...fee, status: 'Paid' } : fee);
                
                updatedStudents[studentIndex] = studentToUpdate;
                newSchoolData[className].students = updatedStudents;

                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(studentToUpdate);
                }
                return newSchoolData;
            }
        }
        return prev;
    });
  };


  const handleAddNotice = (noticeData: Omit<Notice, 'id' | 'date' | 'issuedBy'>) => {
    const newNotice: Notice = {
        ...noticeData,
        id: `notice-${Date.now()}`,
        date: new Date().toISOString(),
        issuedBy: 'Admin'
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const handleAddDigitalDocument = (studentId: string, docData: Omit<DigitalDocument, 'id' | 'date' | 'uploadedBy' | 'url'>) => {
    const newDoc: DigitalDocument = {
        ...docData,
        id: `doc-${Date.now()}`,
        date: new Date().toISOString(),
        uploadedBy: 'Admin',
        url: '#' // Mock URL
    };

    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        let studentFound = false;
        for (const className in newSchoolData) {
            const studentIndex = newSchoolData[className].students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...newSchoolData[className].students];
                const studentToUpdate = updatedStudents[studentIndex];
                studentToUpdate.digitalDocuments.push(newDoc);
                newSchoolData[className].students = updatedStudents;
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent({ ...studentToUpdate });
                }
                studentFound = true;
                break;
            }
        }
        return studentFound ? newSchoolData : prev;
    });
  };

  const handleDeleteDigitalDocument = (studentId: string, docId: string) => {
    setSchoolData(prev => {
        if (!prev) return null;
        const newSchoolData = { ...prev };
        for (const className in newSchoolData) {
            const studentIndex = newSchoolData[className].students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                const updatedStudents = [...newSchoolData[className].students];
                const studentToUpdate = updatedStudents[studentIndex];
                studentToUpdate.digitalDocuments = studentToUpdate.digitalDocuments.filter(doc => doc.id !== docId);
                newSchoolData[className].students = updatedStudents;
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent({ ...studentToUpdate });
                }
                return newSchoolData;
            }
        }
        return prev;
    });
  };

  const handleAddEContent = (className: string, contentData: Omit<EContentItem, 'id' | 'date' | 'uploadedBy' | 'url'>) => {
    if (!schoolData || !schoolData[className] || !loggedInTeacher) return;

    const newContent: EContentItem = {
        ...contentData,
        id: `ec-${Date.now()}`,
        date: new Date().toISOString(),
        uploadedBy: loggedInTeacher.name,
        url: '#' // Mock URL
    };
    
    setSchoolData(prev => {
        if (!prev) return null;
        const updatedClass = { ...prev[className], eContent: [newContent, ...prev[className].eContent] };
        return { ...prev, [className]: updatedClass };
    });
  };

  const handleDeleteEContent = (className: string, contentId: string) => {
    if (!schoolData || !schoolData[className]) return;

    setSchoolData(prev => {
        if (!prev) return null;
        const updatedContent = prev[className].eContent.filter(c => c.id !== contentId);
        const updatedClass = { ...prev[className], eContent: updatedContent };
        return { ...prev, [className]: updatedClass };
    });
  };

  const handleAddClass = (className: string) => {
      if (schoolData && schoolData[className]) {
          alert("Class already exists!");
          return;
      }
      setSchoolData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              [className]: {
                  students: [],
                  teachers: [],
                  academicHeadId: '',
                  eContent: []
              }
          };
      });
  };

  const handleDeleteClass = (className: string) => {
      if (!window.confirm(`Are you sure you want to delete Class ${className}? This will permanently remove all students and teachers associated with this class.`)) return;
      
      setSchoolData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          delete newData[className];
          return newData;
      });
      if (selectedClass === className) {
          setSelectedClass(null);
      }
  };


  const displayedStudents = useMemo(() => {
    if (!userRole || !schoolData) return [];
    switch (userRole) {
      case UserRole.Admin:
        return allStudents;
      case UserRole.Teacher:
        return teacherClass ? schoolData[teacherClass].students : [];
      case UserRole.Parent:
      case UserRole.Student:
        return selectedStudent ? [selectedStudent] : [];
      default:
        return [];
    }
  }, [userRole, schoolData, allStudents, selectedStudent, teacherClass]);
  
  const handleSelectStudent = (student: Student) => {
    if (userRole === UserRole.Parent || userRole === UserRole.Student) return;
    setSelectedStudent(student);
    setSelectedClass(null);
    setSelectedTeacher(null);
    setView(View.Students);
    if(window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  
  const handleSelectClass = (className: string) => {
      setSelectedClass(className);
      setSelectedStudent(null);
      setSelectedTeacher(null);
      setView(View.Classes);
      if(window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  }

  const handleSelectTeacher = (teacher: Teacher) => {
    if (userRole !== UserRole.Admin) return;
    setSelectedTeacher(teacher);
    setView(View.Teachers);
    setSelectedStudent(null);
    setSelectedClass(null);
    if(window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSetView = (newView: View) => {
    if ((userRole === UserRole.Parent || userRole === UserRole.Student) && (newView === View.Students || newView === View.Dashboard)) {
      if(displayedStudents.length > 0 && selectedStudent?.id !== displayedStudents[0].id) {
          setSelectedStudent(displayedStudents[0]);
      }
    }
    if(newView !== View.Classes) setSelectedClass(null);
    if(newView !== View.Teachers) setSelectedTeacher(null);

    // If teacher is navigating to the Student view, reset to show the list.
    if (userRole === UserRole.Teacher && newView === View.Students) {
        setSelectedStudent(null);
    }

    setView(newView);
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
        <Spinner />
        <p className="text-gray-500">Loading School Data...</p>
      </div>
    );
  }

  if (!userRole || !schoolData) {
    return <Login onLogin={attemptLogin} />;
  }

  const renderContent = () => {
    const isAcademicHead = userRole === UserRole.Teacher && loggedInTeacher && teacherClass ? schoolData[teacherClass]?.academicHeadId === loggedInTeacher.id : false;

    switch (view) {
      case View.Dashboard:
        if (userRole === UserRole.Admin) {
            return <AdminDashboard schoolData={schoolData} studentRequests={studentRequests} setView={setView} onSelectClass={handleSelectClass} onAddClass={handleAddClass} onDeleteClass={handleDeleteClass} />;
        }
        const studentForDashboard = userRole === UserRole.Student ? selectedStudent : null;
        return <Dashboard notices={notices} students={displayedStudents} onSelectStudent={handleSelectStudent} userRole={userRole!} onAddStudent={() => setAddStudentModalOpen(true)} isAcademicHead={isAcademicHead} student={studentForDashboard} onUpdateAttendance={handleUpdateStudentAttendance}/>;
      case View.Students:
        if (userRole === UserRole.Teacher) {
          return selectedStudent 
            ? <StudentDetail 
                student={selectedStudent} 
                userRole={userRole!} 
                view={view} 
                setView={setView} 
                onUpdateAttendance={(newCount) => handleUpdateStudentAttendance(selectedStudent.id, newCount)} 
                onUpdateScore={handleUpdateStudentScore} 
                onUpdateSkills={handleUpdateStudentSkills} 
                loggedInTeacher={loggedInTeacher} 
                onBackToList={() => setSelectedStudent(null)} 
              />
            : <TeacherStudentSelection students={displayedStudents} onSelectStudent={handleSelectStudent} />;
        }
        return selectedStudent 
            ? <StudentDetail 
                student={selectedStudent} 
                userRole={userRole!} 
                view={view} 
                setView={setView} 
                onUpdatePracticeScore={userRole === UserRole.Student ? handleUpdateStudentPracticeScore : undefined} 
                onAddDocument={userRole === UserRole.Admin ? (doc) => handleAddDigitalDocument(selectedStudent.id, doc) : undefined} 
                onDeleteDocument={userRole === UserRole.Admin ? (docId) => handleDeleteDigitalDocument(selectedStudent.id, docId) : undefined} 
                onUpdateProfilePic={userRole === UserRole.Admin ? handleUpdateStudentProfilePic : undefined} 
                onUpdateSkills={userRole === UserRole.Admin ? handleUpdateStudentSkills : undefined}
              /> 
            : <div className="p-8 text-center text-gray-500">Please select a student to view details.</div>;
      case View.Documents:
        return selectedStudent ? <DigitalDocs student={selectedStudent} userRole={userRole!} view={view} setView={setView} onAddDocument={userRole === UserRole.Admin || userRole === UserRole.Teacher ? (doc) => handleAddDigitalDocument(selectedStudent.id, doc) : undefined} /> : <div className="p-8 text-center text-gray-500">Please select a student to generate documents.</div>;
      case View.Fees:
        return selectedStudent ? <FeePayment student={selectedStudent} userRole={userRole!} view={view} setView={setView} onPayFees={handleFeePayment}/> : <div className="p-8 text-center text-gray-500">Please select a student to view fees.</div>;
      case View.Skills:
        return selectedStudent 
          ? <StudentDetail 
              student={selectedStudent} 
              userRole={userRole!} 
              view={view} 
              setView={setView} 
              onUpdateAttendance={userRole === UserRole.Teacher ? (newCount) => handleUpdateStudentAttendance(selectedStudent.id, newCount) : undefined}
              onUpdateScore={userRole === UserRole.Teacher ? handleUpdateStudentScore : undefined}
              onUpdateSkills={handleUpdateStudentSkills} 
              loggedInTeacher={loggedInTeacher} 
              onBackToList={userRole === UserRole.Teacher ? () => setSelectedStudent(null) : undefined}
            />
          : <div className="p-8 text-center text-gray-500">Please select a student to view skills.</div>;
      case View.Classes:
          return selectedClass && schoolData[selectedClass] ? <ClassDetail className={selectedClass} classData={schoolData[selectedClass]} allClasses={Object.keys(schoolData)} onSelectStudent={handleSelectStudent} onSetAcademicHead={userRole === UserRole.Admin ? handleSetAcademicHead : undefined} onSelectTeacher={userRole === UserRole.Admin ? handleSelectTeacher : undefined} onAddTeacher={userRole === UserRole.Admin && selectedClass ? (teacherName) => handleAddTeacher(selectedClass, teacherName) : undefined} onDeleteTeacher={userRole === UserRole.Admin ? (teacherId) => handleDeleteTeacher(selectedClass, teacherId) : undefined} onDeleteStudent={userRole === UserRole.Admin ? (studentId) => handleDeleteStudent(selectedClass, studentId) : undefined} onUpdateTeacherClasses={userRole === UserRole.Admin ? handleUpdateTeacherClasses : undefined} onUpdateTeacherSubjects={userRole === UserRole.Admin ? handleUpdateTeacherSubjects : undefined} /> : <div className="p-8 text-center text-gray-500">Please select a class to view details.</div>;
      case View.Requests:
          return <Requests requests={studentRequests} onApprove={handleApproveRequest} onDeny={handleDenyRequest} />;
      case View.Teachers:
          return selectedTeacher && userRole === UserRole.Admin ? <TeacherDetail teacher={selectedTeacher} onUpdateTeacher={handleUpdateTeacher} userRole={userRole} /> : <div className="p-8 text-center text-gray-500">Please select a teacher to view details.</div>;
      case View.Academics:
          return userRole === UserRole.Teacher && loggedInTeacher && teacherClass && schoolData[teacherClass] ? <AcademicsView teacher={loggedInTeacher} students={schoolData[teacherClass].students} onUpdateScore={handleUpdateStudentScore} /> : <div className="p-8 text-center text-gray-500">Academics view is only available for teachers.</div>;
      case View.Attendance:
          if (userRole === UserRole.Teacher && teacherClass && schoolData[teacherClass]) {
              return <AttendanceView students={schoolData[teacherClass].students} onUpdateAttendance={handleUpdateStudentAttendance} className={teacherClass} />;
          } else if (userRole === UserRole.Admin && selectedClass && schoolData[selectedClass]) {
              return <AttendanceView students={schoolData[selectedClass].students} onUpdateAttendance={handleUpdateStudentAttendance} className={selectedClass} />;
          }
          return <div className="p-8 text-center text-gray-500">Select a class to mark attendance, or you do not have permission to view this page.</div>;
      case View.Notices:
          return userRole === UserRole.Admin ? <NoticeBoard notices={notices} onAddNotice={handleAddNotice} /> : <div className="p-8 text-center text-gray-500">You do not have permission to view this page.</div>;
      case View.EContent:
          return userRole === UserRole.Student && selectedStudent && schoolData[selectedStudent.class] ? <EContentView classData={schoolData[selectedStudent.class]} /> : <div className="p-8 text-center text-gray-500">E-Content not available.</div>;
      case View.ManageEContent:
          return userRole === UserRole.Teacher && teacherClass && schoolData[teacherClass] ? <ManageEContentView classData={schoolData[teacherClass]} onAddContent={(content) => handleAddEContent(teacherClass, content)} onDeleteContent={(contentId) => handleDeleteEContent(teacherClass, contentId)} /> : <div className="p-8 text-center text-gray-500">You do not have permission to manage E-Content.</div>;
      default:
        return <Dashboard notices={notices} students={displayedStudents} onSelectStudent={handleSelectStudent} userRole={userRole!} onAddStudent={() => setAddStudentModalOpen(true)} isAcademicHead={isAcademicHead} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        displayedStudents={displayedStudents} 
        schoolData={schoolData}
        selectedStudent={selectedStudent} 
        onSelectStudent={handleSelectStudent}
        onSelectClass={handleSelectClass}
        selectedClass={selectedClass}
        view={view}
        setView={handleSetView}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole={userRole!}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        pendingRequests={studentRequests.filter(r => r.status === 'pending').length}
        loggedInTeacher={loggedInTeacher}
        onLogout={handleLogout}
        onChangePassword={() => setChangePasswordModalOpen(true)}
        adminProfilePic={adminProfilePic}
        onUpdateAdminPic={handleUpdateAdminPic}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          userRole={userRole}
          notices={notices}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        onSubmit={userRole === UserRole.Admin ? handleAddStudent : handleAddStudentRequest}
        userRole={userRole}
        teacherClass={teacherClass}
        schoolData={schoolData}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
};

export default App;
