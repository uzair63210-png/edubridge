
import type { SchoolData, Student } from '../types';

// Helper to check local storage
const STORAGE_KEY = 'edubridge_school_data';
const API_URL = 'http://localhost:3001/api/school-data';

const initialTeachers = [
  { id: 'T01', name: 'Mrs. Sharma', loginCode: 'T-SHARMA6', password: '1234', profilePicUrl: '', subjects: ['Science', 'Mathematics'], attendance: { total: 180, present: 178 }, classesTaken: { weekly: 20, total: 580 } },
  { id: 'T02', name: 'Mr. Kumar', loginCode: 'T-KUMAR6', password: '1234', profilePicUrl: '', subjects: ['English', 'History'], attendance: { total: 180, present: 176 }, classesTaken: { weekly: 20, total: 585 } },
  { id: 'T03', name: 'Mr. Verma', loginCode: 'T-VERMA7', password: '1234', profilePicUrl: '', subjects: ['History', 'English'], attendance: { total: 180, present: 170 }, classesTaken: { weekly: 18, total: 550 } },
  { id: 'T04', name: 'Ms. Reddy', loginCode: 'T-REDDY7', password: '1234', profilePicUrl: '', subjects: ['Geography'], attendance: { total: 180, present: 172 }, classesTaken: { weekly: 18, total: 560 } },
  { id: 'T05', name: 'Ms. Gupta', loginCode: 'T-GUPTA8', password: '1234', profilePicUrl: '', subjects: ['Geography', 'Hindi'], attendance: { total: 180, present: 175 }, classesTaken: { weekly: 22, total: 610 } },
  { id: 'T06', name: 'Mr. Joshi', loginCode: 'T-JOSHI8', password: '1234', profilePicUrl: '', subjects: ['Science', 'Physical Education'], attendance: { total: 180, present: 177 }, classesTaken: { weekly: 23, total: 620 } },
  { id: 'T07', name: 'Mr. Singh', loginCode: 'T-SINGH9', password: '1234', profilePicUrl: '', subjects: ['Physical Education', 'Art'], attendance: { total: 180, present: 179 }, classesTaken: { weekly: 19, total: 575 } },
  { id: 'T08', name: 'Mrs. Das', loginCode: 'T-DAS9', password: '1234', profilePicUrl: '', subjects: ['English', 'Art'], attendance: { total: 180, present: 179 }, classesTaken: { weekly: 19, total: 570 } },
  { id: 'T09', name: 'Mrs. Patel', loginCode: 'T-PATEL10', password: '1234', profilePicUrl: '', subjects: ['Mathematics', 'Science'], attendance: { total: 180, present: 165 }, classesTaken: { weekly: 21, total: 590 } },
  { id: 'T10', name: 'Mr. Menon', loginCode: 'T-MENON10', password: '1234', profilePicUrl: '', subjects: ['Mathematics', 'Hindi'], attendance: { total: 180, present: 174 }, classesTaken: { weekly: 20, total: 595 } },
];

const sampleStudents: Omit<Student, 'id' | 'profilePicUrl'>[] = [
    {
        name: 'Aarav Sharma', class: '6th', rollNumber: 601, password: '1234', guardianName: 'Ravi Sharma', contact: '9876543210', address: '123, Main Street, Delhi',
        skills: [{ skill: 'Creativity', level: 4 }, { skill: 'Communication', level: 3 }, { skill: 'Teamwork', level: 5 }],
        scores: [{ subject: 'Science', score: 88 }, { subject: 'Mathematics', score: 92 }, { subject: 'English', score: 85 }, { subject: 'History', score: 78 }],
        practiceScores: [{ subject: 'Science', score: 80 }, { subject: 'Mathematics', score: 85 }],
        attendance: { total: 180, present: 170 },
        fees: [{ id: 'fee-1', type: 'Tuition', amount: 1500, dueDate: '2024-09-01', status: 'Due' }],
        digitalDocuments: [
            { id: 'doc-1', title: 'Term 1 Marksheet', documentType: 'Marksheet', url: '#', uploadedBy: 'Admin', date: new Date('2025-08-15').toISOString() },
            { id: 'doc-2', title: 'Aadhaar Card Scan', documentType: 'Aadhaar Card', url: '#', uploadedBy: 'Admin', date: new Date('2025-04-10').toISOString() },
        ]
    },
    {
        name: 'Priya Patel', class: '6th', rollNumber: 602, password: '1234', guardianName: 'Suresh Patel', contact: '9876543211', address: '456, Park Avenue, Mumbai',
        skills: [{ skill: 'Leadership', level: 5 }, { skill: 'Problem Solving', level: 4 }, { skill: 'Art', level: 3 }],
        scores: [{ subject: 'Science', score: 95 }, { subject: 'Mathematics', score: 89 }, { subject: 'English', score: 91 }, { subject: 'History', score: 85 }],
        practiceScores: [{ subject: 'Science', score: 90 }],
        attendance: { total: 180, present: 175 },
        fees: [{ id: 'fee-2', type: 'Tuition', amount: 1500, dueDate: '2024-09-01', status: 'Paid' }],
        digitalDocuments: [
             { id: 'doc-3', title: 'Term 1 Marksheet', documentType: 'Marksheet', url: '#', uploadedBy: 'Admin', date: new Date('2025-08-15').toISOString() },
        ]
    }
];

const classes = ["6th", "7th", "8th", "9th", "10th"];

const generateInitialData = (): SchoolData => {
  const schoolData: SchoolData = {};
  
  classes.forEach((className, index) => {
    // Assign two teachers to each class
    const teacher1 = initialTeachers[index * 2];
    const teacher2 = initialTeachers[index * 2 + 1];
    const teachers = [teacher1, teacher2].filter(Boolean);

    let students: Student[] = [];
    if (className === "6th") {
        students = sampleStudents.map((s, i) => ({
            ...s,
            id: `stu-${className}-${i}`,
            profilePicUrl: '',
        }));
    }

    if (teachers.length > 0) {
        schoolData[className] = {
            teachers: teachers,
            students: students,
            academicHeadId: teachers[0].id,
            eContent: className === "6th" ? [
                { id: 'ec-1', title: 'Chapter 1: The Living World - Notes', type: 'pdf', url: '#', uploadedBy: 'Mrs. Sharma', date: new Date('2025-10-20').toISOString() },
                { id: 'ec-2', title: 'Algebra Basics Video Lecture', type: 'video', url: '#', uploadedBy: 'Mrs. Sharma', date: new Date('2025-10-22').toISOString() },
            ] : [],
        };
    }
  });

  return schoolData;
}

export const getInitialSchoolData = async (): Promise<SchoolData> => {
  // 1. Try to fetch from Backend Server (Your Laptop)
  try {
      const response = await fetch(API_URL);
      if (response.ok) {
          const data = await response.json();
          if (data) {
              console.log("Loaded data from Server");
              // Update local cache
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              return data;
          }
      }
  } catch (e) {
      console.warn("Server unavailable, falling back to local storage.", e);
  }

  // 2. Fallback to Local Storage (Offline Mode)
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
      try {
          console.log("Loaded data from LocalStorage");
          return JSON.parse(storedData);
      } catch (e) {
          console.error("Failed to parse stored school data", e);
      }
  }

  // 3. Generate Mock Data if nothing else exists
  console.log("Generating initial mock data");
  return generateInitialData();
};

export const saveSchoolData = async (data: SchoolData) => {
    // 1. Always save to LocalStorage (Immediate / Offline support)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // 2. Try to sync with Server (Background sync)
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log("Data synced to Server");
    } catch (e) {
        console.warn("Failed to sync with server. Data saved locally.", e);
    }
};
