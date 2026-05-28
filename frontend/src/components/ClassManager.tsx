import React, { useMemo, useState } from "react";
import { useStudents } from "../context/StudentContext";
import {
  Users,
  GraduationCap,
  Award,
  Search,
  School,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Building,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import type {
  DepartmentOption,
  SchoolClassOption,
  SubjectOption,
} from "../types/student";

export const ClassManager: React.FC = () => {
  const {
    students,
    departments,
    classes,
    subjects,
    addDepartment,
    addClass,
    updateDepartment,
    deleteDepartment,
    updateClass,
    deleteClass,
    addSubject,
    updateSubject,
    deleteSubject,
  } = useStudents();

  // Local state for tabs: 'classes' | 'departments' | 'subjects'
  const [activeTab, setActiveTab] = useState<
    "classes" | "departments" | "subjects"
  >("classes");

  // Search & input fields
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Subject creation state
  const [subjCode, setSubjCode] = useState("");
  const [subjName, setSubjName] = useState("");
  const [subjCredits, setSubjCredits] = useState(3);

  // Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Editing state
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentOption | null>(null);
  const [editDeptName, setEditDeptName] = useState("");
  const [editAdmissionCode, setEditAdmissionCode] = useState("");

  const [editingClass, setEditingClass] = useState<SchoolClassOption | null>(
    null,
  );
  const [editClassCode, setEditClassCode] = useState("");
  const [editClassDept, setEditClassDept] = useState("");

  const [editingSubject, setEditingSubject] = useState<SubjectOption | null>(
    null,
  );
  const [editSubjCode, setEditSubjCode] = useState("");
  const [editSubjName, setEditSubjName] = useState("");
  const [editSubjCredits, setEditSubjCredits] = useState(3);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "class" | "dept" | "subject";
    id: number;
    nameOrCode: string;
  } | null>(null);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // Calculations for Classes
  const classStats = useMemo(() => {
    return classes.map((schoolClass) => {
      const classStudents = students.filter(
        (student) => student.className === schoolClass.code,
      );
      const studentCount = classStudents.length;
      const averageGpa =
        studentCount > 0
          ? parseFloat(
              (
                classStudents.reduce((sum, student) => sum + student.gpa, 0) /
                studentCount
              ).toFixed(2),
            )
          : 0;
      const excellentCount = classStudents.filter(
        (student) => student.gpa >= 3.6,
      ).length;

      return {
        id: schoolClass.id,
        code: schoolClass.code,
        department: schoolClass.departmentName,
        studentCount,
        averageGpa,
        excellentCount,
      };
    });
  }, [classes, students]);

  // Calculations for Departments
  const departmentStats = useMemo(() => {
    return departments.map((dept) => {
      const deptClasses = classes.filter(
        (c) => c.departmentName.toLowerCase() === dept.name.toLowerCase(),
      );
      const deptStudents = students.filter(
        (s) => s.department.toLowerCase() === dept.name.toLowerCase(),
      );
      const studentCount = deptStudents.length;
      const averageGpa =
        studentCount > 0
          ? parseFloat(
              (
                deptStudents.reduce((sum, student) => sum + student.gpa, 0) /
                studentCount
              ).toFixed(2),
            )
          : 0;
      const excellentCount = deptStudents.filter(
        (student) => student.gpa >= 3.6,
      ).length;

      return {
        id: dept.id,
        name: dept.name,
        classCount: deptClasses.length,
        studentCount,
        averageGpa,
        excellentCount,
      };
    });
  }, [departments, classes, students]);

  // Calculations for Subjects
  const subjectStats = useMemo(() => {
    return subjects.map((subj) => {
      // Find all students having this subjectCode in their grades
      const takers = students.filter((student) =>
        student.grades.some(
          (grade) =>
            grade.subjectCode.toLowerCase() === subj.code.toLowerCase(),
        ),
      );

      const takerGrades = students.flatMap((student) =>
        student.grades.filter(
          (grade) =>
            grade.subjectCode.toLowerCase() === subj.code.toLowerCase(),
        ),
      );

      const takerCount = takers.length;
      const averageScore =
        takerGrades.length > 0
          ? parseFloat(
              (
                takerGrades.reduce((sum, g) => sum + g.score, 0) /
                takerGrades.length
              ).toFixed(2),
            )
          : 0;
      const excellentCount = takerGrades.filter((g) => g.score >= 8.0).length;

      return {
        id: subj.id,
        code: subj.code,
        name: subj.name,
        credits: subj.credits,
        studentCount: takerCount,
        averageScore,
        excellentCount,
      };
    });
  }, [subjects, students]);

  // Filtered Class List
  const filteredClasses = useMemo(() => {
    if (!searchTerm.trim()) return classStats;
    const term = searchTerm.toLowerCase();
    return classStats.filter(
      (item) =>
        item.code.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term),
    );
  }, [classStats, searchTerm]);

  // Filtered Department List
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departmentStats;
    const term = searchTerm.toLowerCase();
    return departmentStats.filter((item) =>
      item.name.toLowerCase().includes(term),
    );
  }, [departmentStats, searchTerm]);

  // Filtered Subject List
  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjectStats;
    const term = searchTerm.toLowerCase();
    return subjectStats.filter(
      (item) =>
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term),
    );
  }, [subjectStats, searchTerm]);

  // Create handlers
  const handleAddDepartment = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    const name = departmentName.trim();
    if (!name) {
      setError("Vui lòng nhập tên khoa.");
      return;
    }

    try {
      await addDepartment(name);
      setDepartmentName("");
      setMessage(`Đã thêm khoa mới: "${name}".`);
    } catch (err: any) {
      setError(
        err?.message ||
          "Không thể thêm khoa. Khoa có thể đã tồn tại hoặc có lỗi kết nối.",
      );
    }
  };

  const handleAddClass = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    const code = classCode.trim().toUpperCase();
    const department = selectedDepartment || departments[0]?.name || "";
    if (!code || !department) {
      setError("Vui lòng nhập mã lớp và chọn khoa.");
      return;
    }

    try {
      await addClass(code, department);
      setClassCode("");
      setSelectedDepartment(department);
      setMessage(`Đã thêm lớp mới: "${code}".`);
    } catch (err: any) {
      setError(
        err?.message ||
          "Không thể thêm lớp. Lớp có thể đã tồn tại hoặc có lỗi kết nối.",
      );
    }
  };

  const handleAddSubject = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    const code = subjCode.trim().toUpperCase();
    const name = subjName.trim();
    const credits = Number(subjCredits);

    if (!code || !name || credits < 1) {
      setError("Vui lòng nhập đầy đủ mã môn, tên môn và số tín chỉ (>= 1).");
      return;
    }

    try {
      await addSubject(code, name, credits);
      setSubjCode("");
      setSubjName("");
      setSubjCredits(3);
      setMessage(`Đã thêm môn học mới: [${code}] ${name}.`);
    } catch (err: any) {
      setError(
        err?.message || "Không thể thêm môn học. Môn học có thể đã tồn tại.",
      );
    }
  };

  // Edit action triggers
  const startEditDepartment = (dept: DepartmentOption) => {
    setEditingDepartment(dept);
    setEditDeptName(dept.name);
    setEditAdmissionCode(dept.admissionCode);
    clearMessages();
  };

  const handleUpdateDepartment = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    if (!editingDepartment) return;

    const name = editDeptName.trim();
    const admissionCode = editAdmissionCode.trim();
    if (!name || !admissionCode) {
      setError("Tên khoa và mã tuyển sinh không được để trống.");
      return;
    }

    try {
      await updateDepartment(editingDepartment.id, name, admissionCode);
      setEditingDepartment(null);
      setMessage("Đã cập nhật thông tin khoa thành công.");
    } catch (err: any) {
      setError(
        err?.message ||
          "Lỗi khi cập nhật khoa. Tên khoa hoặc mã tuyển sinh có thể đã trùng.",
      );
    }
  };

  const startEditClass = (schoolClass: SchoolClassOption) => {
    setEditingClass(schoolClass);
    setEditClassCode(schoolClass.code);
    setEditClassDept(schoolClass.departmentName);
    clearMessages();
  };

  const handleUpdateClass = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    if (!editingClass) return;

    const code = editClassCode.trim().toUpperCase();
    const deptName = editClassDept || departments[0]?.name || "";
    if (!code || !deptName) {
      setError("Mã lớp và khoa không được để trống.");
      return;
    }

    try {
      await updateClass(editingClass.id, code, deptName);
      setEditingClass(null);
      setMessage("Đã cập nhật thông tin lớp học thành công.");
    } catch (err: any) {
      setError(
        err?.message || "Lỗi khi cập nhật lớp học. Mã lớp có thể đã trùng.",
      );
    }
  };

  const startEditSubject = (subj: SubjectOption) => {
    setEditingSubject(subj);
    setEditSubjCode(subj.code);
    setEditSubjName(subj.name);
    setEditSubjCredits(subj.credits);
    clearMessages();
  };

  const handleUpdateSubject = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    if (!editingSubject) return;

    const code = editSubjCode.trim().toUpperCase();
    const name = editSubjName.trim();
    const credits = Number(editSubjCredits);

    if (!code || !name || credits < 1) {
      setError(
        "Thông tin môn học không được để trống và số tín chỉ phải lớn hơn 0.",
      );
      return;
    }

    try {
      await updateSubject(editingSubject.id, code, name, credits);
      setEditingSubject(null);
      setMessage("Đã cập nhật thông tin môn học thành công.");
    } catch (err: any) {
      setError(
        err?.message || "Lỗi khi cập nhật môn học. Mã môn học có thể đã trùng.",
      );
    }
  };

  // Delete handler triggers
  const triggerDelete = (
    type: "class" | "dept" | "subject",
    id: number,
    nameOrCode: string,
  ) => {
    setDeleteConfirm({ type, id, nameOrCode });
    clearMessages();
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    try {
      if (type === "dept") {
        await deleteDepartment(id);
        setMessage("Đã xóa khoa thành công.");
      } else if (type === "class") {
        await deleteClass(id);
        setMessage("Đã xóa lớp học thành công.");
      } else {
        await deleteSubject(id);
        setMessage("Đã xóa môn học thành công.");
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Không thể xóa do có lỗi xảy ra hoặc dữ liệu đang bị ràng buộc.",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Segmented Local Tabs */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 p-1 rounded-2xl bg-input-bg border border-border-color w-fit shadow-inner">
          <button
            onClick={() => {
              setActiveTab("classes");
              setSearchTerm("");
              clearMessages();
            }}
            className={`px-6 py-2.5 rounded-xl font-title font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "classes"
                ? "bg-accent-gradient text-white shadow-md"
                : "text-text-secondary hover:text-text-primary bg-transparent"
            }`}
          >
            Quản lý Lớp học
          </button>
          <button
            onClick={() => {
              setActiveTab("departments");
              setSearchTerm("");
              clearMessages();
            }}
            className={`px-6 py-2.5 rounded-xl font-title font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "departments"
                ? "bg-accent-gradient text-white shadow-md"
                : "text-text-secondary hover:text-text-primary bg-transparent"
            }`}
          >
            Quản lý Khoa
          </button>
          <button
            onClick={() => {
              setActiveTab("subjects");
              setSearchTerm("");
              clearMessages();
            }}
            className={`px-6 py-2.5 rounded-xl font-title font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "subjects"
                ? "bg-accent-gradient text-white shadow-md"
                : "text-text-secondary hover:text-text-primary bg-transparent"
            }`}
          >
            Quản lý Môn học
          </button>
        </div>
      </div>

      {/* Main Creation Card Form based on active Tab */}
      <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg transition-all duration-300">
        <h3 className="text-base font-bold text-text-primary font-title mb-4 flex items-center gap-2">
          {activeTab === "classes" && (
            <School size={18} className="text-primary" />
          )}
          {activeTab === "departments" && (
            <Building size={18} className="text-secondary" />
          )}
          {activeTab === "subjects" && (
            <BookOpen size={18} className="text-[#fbbf24]" />
          )}
          {activeTab === "classes" && "Thêm Lớp Học Mới"}
          {activeTab === "departments" && "Thêm Khoa Mới"}
          {activeTab === "subjects" && "Thêm Môn Học Mới"}
        </h3>

        {activeTab === "departments" && (
          <form
            onSubmit={handleAddDepartment}
            className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Tên khoa mới
              </label>
              <input
                value={departmentName}
                onChange={(event) => setDepartmentName(event.target.value)}
                placeholder="Ví dụ: Công nghệ thông tin"
                className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
              />
            </div>
            <button className="h-12 px-6 rounded-xl font-semibold bg-accent-gradient text-white inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg">
              <Plus size={18} />
              Thêm khoa
            </button>
          </form>
        )}

        {activeTab === "classes" && (
          <form
            onSubmit={handleAddClass}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Mã lớp mới
              </label>
              <input
                value={classCode}
                onChange={(event) => setClassCode(event.target.value)}
                placeholder="Ví dụ: CNTT-01-K16"
                className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm uppercase focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Thuộc khoa
              </label>
              <select
                value={
                  selectedDepartment ||
                  (departments.length > 0 ? departments[0].name : "")
                }
                onChange={(event) => setSelectedDepartment(event.target.value)}
                className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer w-full"
              >
                {departments.length === 0 && (
                  <option value="">Chưa có khoa nào</option>
                )}
                {departments.map((department) => (
                  <option key={department.id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="h-12 px-6 rounded-xl font-semibold bg-accent-gradient text-white inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg">
              <Plus size={18} />
              Thêm lớp
            </button>
          </form>
        )}

        {activeTab === "subjects" && (
          <form
            onSubmit={handleAddSubject}
            className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr_auto] gap-3 items-end"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Mã môn học
              </label>
              <input
                value={subjCode}
                onChange={(event) => setSubjCode(event.target.value)}
                placeholder="Ví dụ: INT1306"
                className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm uppercase focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Tên môn học
              </label>
              <input
                value={subjName}
                onChange={(event) => setSubjName(event.target.value)}
                placeholder="Ví dụ: Lập trình hướng đối tượng"
                className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Số tín chỉ
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={subjCredits}
                onChange={(event) => setSubjCredits(Number(event.target.value))}
                className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
              />
            </div>
            <button className="h-12 px-6 rounded-xl font-semibold bg-accent-gradient text-white inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg">
              <Plus size={18} />
              Thêm môn
            </button>
          </form>
        )}

        {(message || error) && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 ${error ? "bg-red-500/10 text-[#ef4444] border border-red-500/20" : "bg-green-500/10 text-status-active-text border border-green-500/20"}`}
          >
            {error ? <AlertCircle size={16} /> : <Check size={16} />}
            {error || message}
          </div>
        )}
      </div>

      {/* Filter and stats overview */}
      <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:flex-1 min-w-[260px]">
            <Search
              size={20}
              className="absolute left-4 top-[14px] text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder={
                activeTab === "classes"
                  ? "Tìm kiếm lớp học hoặc khoa..."
                  : activeTab === "departments"
                    ? "Tìm kiếm khoa..."
                    : "Tìm kiếm môn học theo tên hoặc mã..."
              }
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-3 focus:ring-primary-glow transition-all duration-200 text-sm"
            />
          </div>
          <span className="text-xs sm:text-sm text-text-secondary font-semibold whitespace-nowrap">
            Đang hiển thị{" "}
            <strong className="font-bold text-text-primary">
              {activeTab === "classes"
                ? filteredClasses.length
                : activeTab === "departments"
                  ? filteredDepartments.length
                  : filteredSubjects.length}
            </strong>{" "}
            {activeTab === "classes"
              ? "lớp học"
              : activeTab === "departments"
                ? "khoa"
                : "môn học"}
          </span>
        </div>
      </div>

      {/* Main Grid View */}
      {activeTab === "classes" &&
        (filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-lg font-extrabold text-text-primary font-title mb-0.5">
                        {item.code}
                      </div>
                      <div className="text-xs text-text-secondary font-semibold flex items-center gap-1">
                        <Building size={12} className="text-text-muted" />
                        {item.department}
                      </div>
                    </div>
                    {/* Action buttons (Edit & Delete) */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-[768px]:opacity-100 shrink-0">
                      <button
                        onClick={() =>
                          startEditClass({
                            id: item.id,
                            code: item.code,
                            departmentName: item.department,
                          })
                        }
                        className="p-2 rounded-lg bg-bg-secondary text-text-secondary hover:text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer border border-border-color"
                        title="Chỉnh sửa lớp học"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() =>
                          triggerDelete("class", item.id, item.code)
                        }
                        className="p-2 rounded-lg bg-bg-secondary text-[#ef4444]/80 hover:text-white hover:bg-[#ef4444] transition-all duration-200 cursor-pointer border border-border-color"
                        title="Xóa lớp học"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border-color">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <Users size={14} className="text-primary" />
                      {item.studentCount}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      Sinh viên
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <GraduationCap size={14} className="text-secondary" />
                      {item.averageGpa > 0
                        ? item.averageGpa.toFixed(2)
                        : "0.00"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      GPA TB
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <Award size={14} className="text-[#fbbf24]" />
                      {item.excellentCount}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      Giỏi
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md flex items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <School
                size={48}
                className="text-text-muted opacity-40 animate-pulse"
              />
              <h4 className="font-title font-bold text-base text-text-primary">
                Không tìm thấy lớp học nào
              </h4>
              <p className="text-xs text-text-secondary">
                Hãy thử điều chỉnh từ khóa tìm kiếm hoặc thêm lớp mới.
              </p>
            </div>
          </div>
        ))}

      {activeTab === "departments" &&
        (filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDepartments.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-base font-extrabold text-text-primary font-title mb-0.5 line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-xs text-text-secondary font-semibold flex items-center gap-1 mt-1">
                        <School size={12} className="text-text-muted" />
                        {item.classCount} Lớp học trực thuộc
                      </div>
                    </div>
                    {/* Action buttons (Edit & Delete) */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-[768px]:opacity-100 shrink-0">
                      <button
                        onClick={() =>
                          startEditDepartment({
                            id: item.id,
                            name: item.name,
                            admissionCode: "",
                          })
                        }
                        className="p-2 rounded-lg bg-bg-secondary text-text-secondary hover:text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer border border-border-color"
                        title="Chỉnh sửa khoa"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() =>
                          triggerDelete("dept", item.id, item.name)
                        }
                        className="p-2 rounded-lg bg-bg-secondary text-[#ef4444]/80 hover:text-white hover:bg-[#ef4444] transition-all duration-200 cursor-pointer border border-border-color"
                        title="Xóa khoa"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border-color">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <Users size={14} className="text-primary" />
                      {item.studentCount}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      Sinh viên
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <GraduationCap size={14} className="text-secondary" />
                      {item.averageGpa > 0
                        ? item.averageGpa.toFixed(2)
                        : "0.00"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      GPA TB
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <Award size={14} className="text-[#fbbf24]" />
                      {item.excellentCount}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      Giỏi
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md flex items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <Building
                size={48}
                className="text-text-muted opacity-40 animate-pulse"
              />
              <h4 className="font-title font-bold text-base text-text-primary">
                Không tìm thấy khoa nào
              </h4>
              <p className="text-xs text-text-secondary">
                Hãy thử điều chỉnh từ khóa tìm kiếm hoặc tạo khoa mới.
              </p>
            </div>
          </div>
        ))}

      {activeTab === "subjects" &&
        (filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg bg-input-bg text-text-secondary border border-border-color mb-2">
                        {item.code}
                      </span>
                      <div className="text-base font-extrabold text-text-primary font-title mb-0.5 line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-xs text-text-secondary font-semibold flex items-center gap-1 mt-2">
                        <BookOpen size={12} className="text-[#fbbf24]" />
                        {item.credits} Tín chỉ
                      </div>
                    </div>
                    {/* Action buttons (Edit & Delete) */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-[768px]:opacity-100 shrink-0">
                      <button
                        onClick={() =>
                          startEditSubject({
                            id: item.id,
                            code: item.code,
                            name: item.name,
                            credits: item.credits,
                          })
                        }
                        className="p-2 rounded-lg bg-bg-secondary text-text-secondary hover:text-[#fbbf24] hover:bg-input-bg transition-colors duration-200 cursor-pointer border border-border-color"
                        title="Chỉnh sửa môn học"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() =>
                          triggerDelete("subject", item.id, item.name)
                        }
                        className="p-2 rounded-lg bg-bg-secondary text-[#ef4444]/80 hover:text-white hover:bg-[#ef4444] transition-all duration-200 cursor-pointer border border-border-color"
                        title="Xóa môn học"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border-color">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <Users size={14} className="text-primary" />
                      {item.studentCount}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      Đang học
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <GraduationCap size={14} className="text-secondary" />
                      {item.averageScore > 0
                        ? item.averageScore.toFixed(1)
                        : "0.0"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      Điểm TB
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                    <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                      <Award size={14} className="text-[#fbbf24]" />
                      {item.excellentCount}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">
                      {"Giỏi (>=8)"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md flex items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <BookOpen
                size={48}
                className="text-text-muted opacity-40 animate-pulse"
              />
              <h4 className="font-title font-bold text-base text-text-primary">
                Không tìm thấy môn học nào
              </h4>
              <p className="text-xs text-text-secondary">
                Hãy thử điều chỉnh từ khóa tìm kiếm hoặc tạo môn học mới.
              </p>
            </div>
          </div>
        ))}

      {/* Editing Department Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-bg-secondary border border-card-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingDepartment(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:bg-input-bg hover:text-text-primary cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-text-primary font-title mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-primary" />
              Chỉnh Sửa Khoa
            </h3>
            <form
              onSubmit={handleUpdateDepartment}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Tên khoa mới
                </label>
                <input
                  value={editDeptName}
                  onChange={(e) => setEditDeptName(e.target.value)}
                  placeholder="Ví dụ: Công nghệ thông tin"
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Mã tuyển sinh
                </label>
                <input
                  value={editAdmissionCode}
                  onChange={(e) => setEditAdmissionCode(e.target.value)}
                  placeholder="Ví dụ: CNTT01"
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm uppercase focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setEditingDepartment(null)}
                  className="h-11 px-5 rounded-xl border border-border-color text-text-primary bg-bg-secondary hover:bg-input-bg font-semibold text-sm cursor-pointer transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-accent-gradient text-white font-semibold text-sm cursor-pointer transition-all hover:shadow-lg"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Class Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-bg-secondary border border-card-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingClass(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:bg-input-bg hover:text-text-primary cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-text-primary font-title mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-primary" />
              Chỉnh Sửa Lớp Học
            </h3>
            <form onSubmit={handleUpdateClass} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Mã lớp mới
                </label>
                <input
                  value={editClassCode}
                  onChange={(e) => setEditClassCode(e.target.value)}
                  placeholder="Ví dụ: CNTT-01-K16"
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm uppercase focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Khoa quản lý
                </label>
                <select
                  value={editClassDept}
                  onChange={(e) => setEditClassDept(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer w-full"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="h-11 px-5 rounded-xl border border-border-color text-text-primary bg-bg-secondary hover:bg-input-bg font-semibold text-sm cursor-pointer transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-accent-gradient text-white font-semibold text-sm cursor-pointer transition-all hover:shadow-lg"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Subject Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-bg-secondary border border-card-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingSubject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:bg-input-bg hover:text-text-primary cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-text-primary font-title mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-primary" />
              Chỉnh Sửa Môn Học
            </h3>
            <form
              onSubmit={handleUpdateSubject}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Mã môn học
                </label>
                <input
                  value={editSubjCode}
                  onChange={(e) => setEditSubjCode(e.target.value)}
                  placeholder="Ví dụ: INT1306"
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm uppercase focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Tên môn học
                </label>
                <input
                  value={editSubjName}
                  onChange={(e) => setEditSubjName(e.target.value)}
                  placeholder="Ví dụ: Kỹ nghệ phần mềm"
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Số tín chỉ
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editSubjCredits}
                  onChange={(e) => setEditSubjCredits(Number(e.target.value))}
                  className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary w-full"
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="h-11 px-5 rounded-xl border border-border-color text-text-primary bg-bg-secondary hover:bg-input-bg font-semibold text-sm cursor-pointer transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-accent-gradient text-white font-semibold text-sm cursor-pointer transition-all hover:shadow-lg"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-bg-secondary border border-card-border p-6 rounded-2xl w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-text-primary font-title mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-[#ef4444]" />
              Xác Nhận Xóa
            </h3>
            <p className="text-sm text-text-secondary mb-5 leading-relaxed">
              Bạn có chắc chắn muốn xóa{" "}
              {deleteConfirm.type === "dept"
                ? `khoa "${deleteConfirm.nameOrCode}"`
                : deleteConfirm.type === "class"
                  ? `lớp học "${deleteConfirm.nameOrCode}"`
                  : `môn học "${deleteConfirm.nameOrCode}"`}{" "}
              không?
              <span className="block mt-2 font-semibold text-[#ef4444] text-xs">
                ⚠️ Cảnh báo: Hành động này không thể hoàn tác và chỉ thực hiện
                được nếu không có dữ liệu sinh viên/điểm số liên kết.
              </span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="h-10 px-4 rounded-xl border border-border-color text-text-primary bg-bg-secondary hover:bg-input-bg font-semibold text-xs cursor-pointer transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="h-10 px-4 rounded-xl bg-[#ef4444] text-white font-semibold text-xs cursor-pointer transition-all hover:bg-[#dc2626] hover:shadow-lg"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
