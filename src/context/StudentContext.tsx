import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Theme, DashboardStats } from '../types/student';
import { initialStudents } from '../mockData';

interface StudentContextType {
  students: Student[];
  theme: Theme;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleTheme: () => void;
  addStudent: (student: Omit<Student, 'activities'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  stats: DashboardStats;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addStudent = (newStudentData: Omit<Student, 'activities'>) => {
    const timestamp = new Date().toISOString();
    const newStudent: Student = {
      ...newStudentData,
      activities: [
        {
          id: `act-${Date.now()}`,
          action: 'Thêm mới sinh viên vào hệ thống',
          timestamp
        }
      ]
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (updatedStudent: Student) => {
    const timestamp = new Date().toISOString();
    setStudents(prev =>
      prev.map(s => {
        if (s.id === updatedStudent.id) {
          // Compare changes to write a log
          const changes: string[] = [];
          if (s.name !== updatedStudent.name) changes.push('Họ tên');
          if (s.gpa !== updatedStudent.gpa) changes.push('Điểm GPA');
          if (s.status !== updatedStudent.status) changes.push('Trạng thái');
          if (s.className !== updatedStudent.className) changes.push('Lớp');
          if (s.department !== updatedStudent.department) changes.push('Khoa');

          const actionMsg = changes.length > 0
            ? `Cập nhật thông tin (${changes.join(', ')})`
            : 'Cập nhật thông tin sinh viên';

          return {
            ...updatedStudent,
            activities: [
              {
                id: `act-${Date.now()}`,
                action: actionMsg,
                timestamp
              },
              ...s.activities
            ]
          };
        }
        return s;
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id);
  };

  // Compute stats
  const totalStudents = students.length;
  const classesSet = new Set(students.map(s => s.className));
  const totalClasses = classesSet.size;
  const averageGpa = totalStudents > 0
    ? parseFloat((students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents).toFixed(2))
    : 0;
  
  // Custom formula for attendance rate based on GPA to make it dynamic
  const attendanceRate = totalStudents > 0
    ? Math.round((students.reduce((sum, s) => {
        // Higher GPA is correlated with slightly better attendance for simulation
        const baseAttendance = 85 + (s.gpa / 4.0) * 12;
        return sum + Math.min(100, Math.max(70, baseAttendance));
      }, 0) / totalStudents))
    : 0;

  const stats: DashboardStats = {
    totalStudents,
    totalClasses,
    averageGpa,
    attendanceRate
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        theme,
        activeTab,
        setActiveTab,
        toggleTheme,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        stats
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
