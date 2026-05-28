import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Theme, DashboardStats, DepartmentOption, SchoolClassOption, SubjectOption } from '../types/student';
import { classes as fallbackClasses, departments as fallbackDepartments, initialStudents } from '../mockData';
import { academicApi, studentApi, subjectApi } from '../api';

interface StudentContextType {
  students: Student[];
  departments: DepartmentOption[];
  classes: SchoolClassOption[];
  subjects: SubjectOption[];
  theme: Theme;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleTheme: () => void;
  addStudent: (student: Omit<Student, 'activities'>) => Promise<Student>;
  updateStudent: (student: Student) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  addDepartment: (name: string) => Promise<DepartmentOption>;
  addClass: (code: string, departmentName: string) => Promise<SchoolClassOption>;
  updateDepartment: (id: number, name: string) => Promise<DepartmentOption>;
  deleteDepartment: (id: number) => Promise<void>;
  updateClass: (id: number, code: string, departmentName: string) => Promise<SchoolClassOption>;
  deleteClass: (id: number) => Promise<void>;
  addSubject: (code: string, name: string, credits: number) => Promise<SubjectOption>;
  updateSubject: (id: number, code: string, name: string, credits: number) => Promise<SubjectOption>;
  deleteSubject: (id: number) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  stats: DashboardStats;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const getFallbackDepartmentForClass = (code: string) => {
  if (code.startsWith('CNTT')) return fallbackDepartments[0] ?? '';
  if (code.startsWith('KTDN')) return fallbackDepartments[1] ?? '';
  if (code.startsWith('DTVT')) return fallbackDepartments[2] ?? '';
  if (code.startsWith('NNA')) return fallbackDepartments[3] ?? '';
  return fallbackDepartments[0] ?? '';
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const migrateStudentGrades = (student: any): Student => {
    if (student.grades && student.grades.length > 0 && 'subjectCode' in student.grades[0]) {
      return student as Student;
    }
    
    const mappedGrades = (student.grades || []).map((g: any) => {
      let code = 'INT1306';
      const name = g.subject || g.subjectName || '';
      if (name.includes('đối tượng')) code = 'INT1306';
      else if (name.includes('Cấu trúc dữ liệu')) code = 'INT1339';
      else if (name.includes('Cơ sở dữ liệu')) code = 'INT1342';
      else if (name.includes('Toán rời rạc')) code = 'MAT1101';
      else if (name.includes('Mạng máy tính')) code = 'INT1335';
      else if (name.includes('Kinh tế vĩ mô')) code = 'ECO1001';
      else if (name.includes('Kinh tế vi mô')) code = 'ECO1002';
      else if (name.includes('Marketing')) code = 'MKT2001';
      else if (name.includes('Thương mại quốc tế')) code = 'ECO2004';
      else if (name.includes('Tiếng Anh thương mại')) code = 'ENG2001';
      else if (name.includes('Kỹ thuật điện')) code = 'ECE1001';
      else if (name.includes('Xử lý tín hiệu')) code = 'ECE2002';
      else if (name.includes('Vi điều khiển')) code = 'ECE2003';
      else if (name.includes('Điện tử số')) code = 'ECE2004';
      else if (name.includes('Lý thuyết mạch')) code = 'ECE1002';
      else if (name.includes('Biên dịch')) code = 'ENG3001';
      else if (name.includes('Phiên dịch')) code = 'ENG3002';
      else if (name.includes('Văn học')) code = 'ENG3003';
      else if (name.includes('thuyết trình')) code = 'ENG1005';
      else if (name.includes('Ngữ pháp')) code = 'ENG2005';
      else if (name.includes('Khóa luận')) code = 'THE4001';
      else if (name.includes('Tin học cơ sở')) code = 'INT1101';
      else if (name.includes('Nhập môn lập trình')) code = 'INT1201';
      else if (name.includes('tuyến tính')) code = 'MAT1102';
      else if (name.includes('Giải tích')) code = 'MAT1103';
      else if (name.includes('Triết học')) code = 'PHI1001';
      else if (name.includes('pháp luật')) code = 'LAW1001';
      else if (name.includes('Toán cao cấp')) code = 'MAT1104';
      else if (name.includes('Quản trị học')) code = 'MGT1001';
      
      const score = typeof g.score === 'number' ? g.score : 8.0;
      return {
        subjectCode: code,
        subjectName: name,
        semester: g.semester || 'Học kỳ I - 2025-2026',
        attendanceScore: score,
        midtermScore: score,
        finalScore: score,
        attendanceWeight: 10,
        midtermWeight: 30,
        finalWeight: 60,
        score: score
      };
    });

    return {
      ...student,
      conductScore: student.conductScore || 85,
      grades: mappedGrades
    } as Student;
  };

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    const parsed = saved ? JSON.parse(saved) : initialStudents;
    return parsed.map(migrateStudentGrades);
  });
  const [departments, setDepartments] = useState<DepartmentOption[]>(
    fallbackDepartments.map((name, index) => ({ id: index + 1, name }))
  );
  const [classes, setClasses] = useState<SchoolClassOption[]>(
    fallbackClasses.map((code, index) => ({
      id: index + 1,
      code,
      departmentName: getFallbackDepartmentForClass(code),
    }))
  );
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const apiStudents = await studentApi.getAll();
        setStudents(apiStudents);
      } catch (error) {
        console.warn('Could not load students from backend. Using local fallback.', error);
      }
    };
    const loadAcademicCatalog = async () => {
      try {
        const [apiDepartments, apiClasses] = await Promise.all([
          academicApi.getDepartments(),
          academicApi.getClasses(),
        ]);
        setDepartments(apiDepartments);
        setClasses(apiClasses);
      } catch (error) {
        console.warn('Could not load academic catalog from backend. Using local fallback.', error);
      }
    };
    const loadSubjects = async () => {
      try {
        const apiSubjects = await subjectApi.getAll();
        setSubjects(apiSubjects);
      } catch (error) {
        console.warn('Could not load subjects from backend. Using local fallbacks.', error);
        setSubjects([
          { id: 1, code: 'INT1306', name: 'Lập trình hướng đối tượng', credits: 3 },
          { id: 2, code: 'INT1339', name: 'Cấu trúc dữ liệu và giải thuật', credits: 4 },
          { id: 3, code: 'INT1342', name: 'Cơ sở dữ liệu', credits: 3 },
          { id: 4, code: 'MAT1101', name: 'Toán rời rạc', credits: 3 },
          { id: 5, code: 'INT1335', name: 'Mạng máy tính', credits: 3 }
        ]);
      }
    };

    void loadStudents();
    void loadAcademicCatalog();
    void loadSubjects();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addStudent = async (newStudentData: Omit<Student, 'activities'>) => {
    const newStudent = await studentApi.create(newStudentData);
    setStudents(prev => [newStudent, ...prev.filter(student => student.id !== newStudent.id)]);
    return newStudent;
  };

  const updateStudent = async (updatedStudent: Student) => {
    const savedStudent = await studentApi.update(updatedStudent);
    setStudents(prev =>
      prev.map(student => (student.id === savedStudent.id ? savedStudent : student))
    );
    return savedStudent;
  };

  const deleteStudent = async (id: string) => {
    await studentApi.delete(id);
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addDepartment = async (name: string) => {
    const newDepartment = await academicApi.createDepartment(name);
    setDepartments(prev => [...prev, newDepartment].sort((a, b) => a.name.localeCompare(b.name, 'vi')));
    return newDepartment;
  };

  const addClass = async (code: string, departmentName: string) => {
    const newClass = await academicApi.createClass(code, departmentName);
    setClasses(prev => [...prev, newClass].sort((a, b) => a.code.localeCompare(b.code)));
    return newClass;
  };

  const updateDepartment = async (id: number, name: string) => {
    const oldDept = departments.find(d => d.id === id);
    const oldName = oldDept ? oldDept.name : '';
    const updatedDept = await academicApi.updateDepartment(id, name);
    setDepartments(prev =>
      prev.map(d => (d.id === id ? updatedDept : d)).sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    );
    if (oldName) {
      setClasses(prev =>
        prev.map(c => (c.departmentName === oldName ? { ...c, departmentName: updatedDept.name } : c))
      );
      setStudents(prev =>
        prev.map(s => (s.department === oldName ? { ...s, department: updatedDept.name } : s))
      );
    }
    return updatedDept;
  };

  const deleteDepartment = async (id: number) => {
    await academicApi.deleteDepartment(id);
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const updateClass = async (id: number, code: string, departmentName: string) => {
    const oldClass = classes.find(c => c.id === id);
    const oldCode = oldClass ? oldClass.code : '';
    const updatedClass = await academicApi.updateClass(id, code, departmentName);
    setClasses(prev =>
      prev.map(c => (c.id === id ? updatedClass : c)).sort((a, b) => a.code.localeCompare(b.code))
    );
    if (oldCode) {
      setStudents(prev =>
        prev.map(s => (s.className === oldCode ? { ...s, className: updatedClass.code } : s))
      );
    }
    return updatedClass;
  };

  const deleteClass = async (id: number) => {
    await academicApi.deleteClass(id);
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const addSubject = async (code: string, name: string, credits: number) => {
    const newSubject = await subjectApi.create(code, name, credits);
    setSubjects(prev => [...prev, newSubject].sort((a, b) => a.code.localeCompare(b.code)));
    return newSubject;
  };

  const updateSubject = async (id: number, code: string, name: string, credits: number) => {
    const oldSubject = subjects.find(s => s.id === id);
    const oldCode = oldSubject ? oldSubject.code : '';
    const updatedSubject = await subjectApi.update(id, code, name, credits);
    setSubjects(prev =>
      prev.map(s => (s.id === id ? updatedSubject : s)).sort((a, b) => a.code.localeCompare(b.code))
    );
    if (oldCode) {
      setStudents(prev =>
        prev.map(s => {
          let modified = false;
          const mappedGrades = s.grades.map(g => {
            if (g.subjectCode === oldCode) {
              modified = true;
              return { ...g, subjectCode: code, subjectName: name };
            }
            return g;
          });
          return modified ? { ...s, grades: mappedGrades } : s;
        })
      );
    }
    return updatedSubject;
  };

  const deleteSubject = async (id: number) => {
    await subjectApi.delete(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const totalStudents = students.length;
  const classesSet = new Set(students.map(student => student.className));
  const totalClasses = classesSet.size;
  const averageGpa = totalStudents > 0
    ? parseFloat((students.reduce((sum, student) => sum + student.gpa, 0) / totalStudents).toFixed(2))
    : 0;
  const attendanceRate = totalStudents > 0
    ? Math.round((students.reduce((sum, student) => {
        const baseAttendance = 85 + (student.gpa / 4.0) * 12;
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
        departments,
        classes,
        subjects,
        theme,
        activeTab,
        setActiveTab,
        toggleTheme,
        addStudent,
        updateStudent,
        deleteStudent,
        addDepartment,
        addClass,
        updateDepartment,
        deleteDepartment,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
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
