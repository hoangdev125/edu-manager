export interface Grade {
  subjectCode: string;
  subjectName: string;
  semester: string;
  attendanceScore: number;
  midtermScore: number;
  finalScore: number;
  attendanceWeight: number;
  midtermWeight: number;
  finalWeight: number;
  score: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
}

export interface Student {
  id: string; // MSSV (Mã số sinh viên)
  name: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  dob: string; // Ngày sinh YYYY-MM-DD
  email: string;
  phone: string;
  address: string;
  className: string;
  department: string;
  gpa: number;
  status: 'Đang học' | 'Bảo lưu' | 'Đã tốt nghiệp';
  grades: Grade[];
  activities: ActivityLog[];
  notes?: string;
  avatar?: string;
  conductScore?: number; // Điểm rèn luyện
}

export type Theme = 'light' | 'dark';

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  averageGpa: number;
  attendanceRate: number;
}

export interface DepartmentOption {
  id: number;
  admissionCode: string;
  name: string;
}

export interface SchoolClassOption {
  id: number;
  code: string;
  departmentName: string;
}

export interface SubjectOption {
  id: number;
  code: string;
  name: string;
  credits: number;
}
