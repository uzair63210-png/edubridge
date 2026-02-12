

export interface Skill {
  id?: string;
  name: string;
  category: 'Academic' | 'Sports' | 'Creative' | 'Technical' | 'Other';
  rating: number; // 1-5 stars
  remarks?: string;
  updatedBy?: string; // teacher name
  updatedAt?: string; // ISO string
}

export interface Score {
  subject: string;
  score: number;
}

export interface Attendance {
  total: number;
  present: number;
}

export interface Fee {
  id: string;
  type: 'Tuition' | 'Exam' | 'Sports' | 'Library';
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Due';
}

export interface EContentItem {
  id: string;
  title: string;
  type: 'pdf' | 'note' | 'video';
  url: string; // a mock url
  uploadedBy: string; // teacher name
  date: string; // ISO string
}

export interface DigitalDocument {
  id: string;
  title: string;
  documentType: 'Marksheet' | 'Aadhaar Card' | 'Birth Certificate' | 'Other';
  url: string; // a mock url
  uploadedBy: string; // admin
  date: string; // ISO string
}

export interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: number;
  guardianName: string;
  contact: string;
  address: string;
  profilePicUrl: string;
  password?: string; // Added password
  skills: Skill[];
  scores: Score[];
  practiceScores?: Score[];
  attendance: Attendance;
  fees: Fee[];
  digitalDocuments: DigitalDocument[];
}

export interface Teacher {
  id: string;
  name: string;
  loginCode: string;
  password?: string; // Added password
  profilePicUrl: string;
  subjects: string[];
  attendance: Attendance;
  classesTaken: {
    weekly: number;
    total: number;
  };
  classesTeaching?: string[]; // Classes this teacher teaches (e.g., ['6A', '7B'])
  headOfClass?: string | null; // Class this teacher is head of (can only be head of 1)
}

export interface ClassData {
    students: Student[];
    teachers: Teacher[];
    academicHeadId: string;
    eContent: EContentItem[];
    division?: string; // e.g., 'A', 'B', 'C'
}

export type SchoolData = Record<string, ClassData>;

export interface StudentRequest {
  id: string;
  student: Omit<Student, 'id' | 'profilePicUrl'>;
  teacherName: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string format
  targetAudience: UserRole[];
  issuedBy: string;
}


export enum UserRole {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Parent = 'Parent',
  Student = 'Student',
}

export enum View {
  Dashboard = 'Dashboard',
  Students = 'Students',
  Documents = 'Documents',
  Fees = 'Fees',
  Classes = 'Classes',
  Requests = 'Requests',
  Teachers = 'Teachers',
  Academics = 'Academics',
  Notices = 'Notices',
  EContent = 'EContent',
  ManageEContent = 'ManageEContent',
  Attendance = 'Attendance',
  Skills = 'Skills',
}