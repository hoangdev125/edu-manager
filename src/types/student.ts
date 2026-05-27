export interface Grade {
  subject: string;
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
}

export type Theme = 'light' | 'dark';

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  averageGpa: number;
  attendanceRate: number;
}
