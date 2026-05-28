import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  Student,
  Theme,
  DashboardStats,
  DepartmentOption,
  SchoolClassOption,
  SubjectOption,
} from "../types/student";
import { academicApi, studentApi, subjectApi } from "../api";

interface StudentContextType {
  students: Student[];
  departments: DepartmentOption[];
  classes: SchoolClassOption[];
  subjects: SubjectOption[];
  theme: Theme;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleTheme: () => void;
  addStudent: (student: Omit<Student, "activities">) => Promise<Student>;
  updateStudent: (student: Student) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  addDepartment: (name: string) => Promise<DepartmentOption>;
  addClass: (
    code: string,
    departmentName: string,
  ) => Promise<SchoolClassOption>;
  updateDepartment: (
    id: number,
    name: string,
    admissionCode: string,
  ) => Promise<DepartmentOption>;
  deleteDepartment: (id: number) => Promise<void>;
  updateClass: (
    id: number,
    code: string,
    departmentName: string,
  ) => Promise<SchoolClassOption>;
  deleteClass: (id: number) => Promise<void>;
  addSubject: (
    code: string,
    name: string,
    credits: number,
  ) => Promise<SubjectOption>;
  updateSubject: (
    id: number,
    code: string,
    name: string,
    credits: number,
  ) => Promise<SubjectOption>;
  deleteSubject: (id: number) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  stats: DashboardStats;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [classes, setClasses] = useState<SchoolClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const apiStudents = await studentApi.getAll();
        setStudents(apiStudents);
      } catch (error) {
        console.warn(
          "Could not load students from backend. Using local fallback.",
          error,
        );
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
        console.warn(
          "Could not load academic catalog from backend. Using local fallback.",
          error,
        );
      }
    };
    const loadSubjects = async () => {
      try {
        const apiSubjects = await subjectApi.getAll();
        setSubjects(apiSubjects);
      } catch (error) {
        console.warn(
          "Could not load subjects from backend. Using local fallbacks.",
          error,
        );
        setSubjects([
          {
            id: 1,
            code: "INT1306",
            name: "Lập trình hướng đối tượng",
            credits: 3,
          },
          {
            id: 2,
            code: "INT1339",
            name: "Cấu trúc dữ liệu và giải thuật",
            credits: 4,
          },
          { id: 3, code: "INT1342", name: "Cơ sở dữ liệu", credits: 3 },
          { id: 4, code: "MAT1101", name: "Toán rời rạc", credits: 3 },
          { id: 5, code: "INT1335", name: "Mạng máy tính", credits: 3 },
        ]);
      }
    };

    void loadStudents();
    void loadAcademicCatalog();
    void loadSubjects();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addStudent = async (newStudentData: Omit<Student, "activities">) => {
    const newStudent = await studentApi.create(newStudentData);
    setStudents((prev) => [
      newStudent,
      ...prev.filter((student) => student.id !== newStudent.id),
    ]);
    return newStudent;
  };

  const updateStudent = async (updatedStudent: Student) => {
    const savedStudent = await studentApi.update(updatedStudent);
    setStudents((prev) =>
      prev.map((student) =>
        student.id === savedStudent.id ? savedStudent : student,
      ),
    );
    return savedStudent;
  };

  const deleteStudent = async (id: string) => {
    await studentApi.delete(id);
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const addDepartment = async (name: string) => {
    const newDepartment = await academicApi.createDepartment(name);
    setDepartments((prev) =>
      [...prev, newDepartment].sort((a, b) =>
        a.name.localeCompare(b.name, "vi"),
      ),
    );
    return newDepartment;
  };

  const addClass = async (code: string, departmentName: string) => {
    const newClass = await academicApi.createClass(code, departmentName);
    setClasses((prev) =>
      [...prev, newClass].sort((a, b) => a.code.localeCompare(b.code)),
    );
    return newClass;
  };

  const updateDepartment = async (
    id: number,
    name: string,
    admissionCode: string,
  ) => {
    const oldDept = departments.find((d) => d.id === id);
    const oldName = oldDept ? oldDept.name : "";
    const updatedDept = await academicApi.updateDepartment(
      id,
      name,
      admissionCode,
    );
    setDepartments((prev) =>
      prev
        .map((d) => (d.id === id ? updatedDept : d))
        .sort((a, b) => a.name.localeCompare(b.name, "vi")),
    );
    if (oldName) {
      setClasses((prev) =>
        prev.map((c) =>
          c.departmentName === oldName
            ? { ...c, departmentName: updatedDept.name }
            : c,
        ),
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.department === oldName ? { ...s, department: updatedDept.name } : s,
        ),
      );
    }
    return updatedDept;
  };

  const deleteDepartment = async (id: number) => {
    await academicApi.deleteDepartment(id);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const updateClass = async (
    id: number,
    code: string,
    departmentName: string,
  ) => {
    const oldClass = classes.find((c) => c.id === id);
    const oldCode = oldClass ? oldClass.code : "";
    const updatedClass = await academicApi.updateClass(
      id,
      code,
      departmentName,
    );
    setClasses((prev) =>
      prev
        .map((c) => (c.id === id ? updatedClass : c))
        .sort((a, b) => a.code.localeCompare(b.code)),
    );
    if (oldCode) {
      setStudents((prev) =>
        prev.map((s) =>
          s.className === oldCode ? { ...s, className: updatedClass.code } : s,
        ),
      );
    }
    return updatedClass;
  };

  const deleteClass = async (id: number) => {
    await academicApi.deleteClass(id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const addSubject = async (code: string, name: string, credits: number) => {
    const newSubject = await subjectApi.create(code, name, credits);
    setSubjects((prev) =>
      [...prev, newSubject].sort((a, b) => a.code.localeCompare(b.code)),
    );
    return newSubject;
  };

  const updateSubject = async (
    id: number,
    code: string,
    name: string,
    credits: number,
  ) => {
    const oldSubject = subjects.find((s) => s.id === id);
    const oldCode = oldSubject ? oldSubject.code : "";
    const updatedSubject = await subjectApi.update(id, code, name, credits);
    setSubjects((prev) =>
      prev
        .map((s) => (s.id === id ? updatedSubject : s))
        .sort((a, b) => a.code.localeCompare(b.code)),
    );
    if (oldCode) {
      setStudents((prev) =>
        prev.map((s) => {
          let modified = false;
          const mappedGrades = s.grades.map((g) => {
            if (g.subjectCode === oldCode) {
              modified = true;
              return { ...g, subjectCode: code, subjectName: name };
            }
            return g;
          });
          return modified ? { ...s, grades: mappedGrades } : s;
        }),
      );
    }
    return updatedSubject;
  };

  const deleteSubject = async (id: number) => {
    await subjectApi.delete(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find((student) => student.id === id);
  };

  const totalStudents = students.length;
  const classesSet = new Set(students.map((student) => student.className));
  const totalClasses = classesSet.size;
  const averageGpa =
    totalStudents > 0
      ? parseFloat(
          (
            students.reduce((sum, student) => sum + student.gpa, 0) /
            totalStudents
          ).toFixed(2),
        )
      : 0;
  const attendanceRate =
    totalStudents > 0
      ? Math.round(
          students.reduce((sum, student) => {
            const baseAttendance = 85 + (student.gpa / 4.0) * 12;
            return sum + Math.min(100, Math.max(70, baseAttendance));
          }, 0) / totalStudents,
        )
      : 0;

  const stats: DashboardStats = {
    totalStudents,
    totalClasses,
    averageGpa,
    attendanceRate,
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
        stats,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
