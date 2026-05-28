import React, { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import type { Student, Grade } from '../types/student';
import { X, Award } from 'lucide-react';
import { PersonalFields } from './subcomponents/PersonalFields';
import { ContactFields } from './subcomponents/ContactFields';
import { AcademicFields } from './subcomponents/AcademicFields';
import { GradeEntryFields } from './subcomponents/GradeEntryFields';

interface StudentModalProps {
  mode: 'add' | 'edit';
  student?: Student;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ mode, student, onClose }) => {
  const { addStudent, updateStudent, students, departments, classes, subjects } = useStudents();

  // Core fields state
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [className, setClassName] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<'Đang học' | 'Bảo lưu' | 'Đã tốt nghiệp'>('Đang học');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState('');
  const [conductScore, setConductScore] = useState<number>(85); // Điểm rèn luyện

  // Dynamic Gradebook
  const [grades, setGrades] = useState<Grade[]>([]);

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form if editing
  useEffect(() => {
    if (mode === 'edit' && student) {
      setId(student.id);
      setName(student.name);
      setGender(student.gender);
      setDob(student.dob);
      setEmail(student.email);
      setPhone(student.phone);
      setAddress(student.address);
      setClassName(student.className);
      setDepartment(student.department);
      setStatus(student.status);
      setNotes(student.notes || '');
      setAvatar(student.avatar || '');
      setConductScore(student.conductScore || 85);
      setGrades(student.grades || []);
    } else {
      // Generate standard random placeholder image for new student
      const randomSeed = Math.floor(Math.random() * 1000);
      setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
      // Default department and class
      setDepartment(departments[0]?.name ?? '');
      setClassName(classes[0]?.code ?? '');
      setConductScore(85);
      
      // Default grade rows (empty at start)
      setGrades([]);
    }
  }, [classes, departments, mode, student]);

  // Handle department change to match default classes
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setDepartment(dept);
    const firstClassForDepartment = classes.find(cls => cls.departmentName === dept);
    setClassName(firstClassForDepartment?.code ?? '');
  };

  // 10-scale grade score to 4.0 scale mapping based on user request table
  const convertTo4Scale = (score10: number): number => {
    if (score10 >= 9.0) return 4.0;
    if (score10 >= 8.0) return 3.5;
    if (score10 >= 7.0) return 3.0;
    if (score10 >= 6.5) return 2.5;
    if (score10 >= 5.5) return 2.0;
    if (score10 >= 5.0) return 1.5;
    if (score10 >= 4.0) return 1.0;
    return 0.0;
  };

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!name.trim()) tempErrors.name = 'Họ tên không được để trống';
    
    if (mode === 'add') {
      if (!id.trim()) {
        tempErrors.id = 'Mã số sinh viên (MSSV) không được trống';
      } else if (students.some(s => s.id.toUpperCase() === id.trim().toUpperCase())) {
        tempErrors.id = 'MSSV này đã tồn tại trong hệ thống';
      }
    }

    if (!dob) {
      tempErrors.dob = 'Vui lòng chọn ngày sinh';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phone.trim()) {
      tempErrors.phone = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(phone)) {
      tempErrors.phone = 'SĐT phải từ 9 đến 11 số';
    }

    if (!address.trim()) {
      tempErrors.address = 'Địa chỉ không được để trống';
    }

    if (conductScore < 0 || conductScore > 100 || isNaN(conductScore)) {
      tempErrors.conductScore = 'Điểm rèn luyện phải từ 0 đến 100';
    }

    // Verify weights total for each grade
    grades.forEach((g, i) => {
      const sum = g.attendanceWeight + g.midtermWeight + g.finalWeight;
      if (sum !== 100) {
        tempErrors.grades = `Môn học thứ ${i + 1} (${g.subjectName}) có tổng trọng số là ${sum}%. Tổng trọng số phải bằng 100%!`;
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Calculate credit-weighted GPA on 4.0 scale
    let weightedGpaSum = 0.0;
    let totalCredits = 0;

    grades.forEach(g => {
      const subj = subjects.find(s => s.code.toLowerCase() === g.subjectCode.toLowerCase());
      const credits = subj ? subj.credits : 3; // Default credits to 3
      const score4 = convertTo4Scale(g.score);

      weightedGpaSum += score4 * credits;
      totalCredits += credits;
    });

    const computedGpa = totalCredits > 0 
      ? parseFloat((weightedGpaSum / totalCredits).toFixed(2))
      : 0.0;

    const finalStudentData = {
      id: id.toUpperCase().trim(),
      name: name.trim(),
      gender,
      dob,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      className,
      department,
      status,
      notes: notes.trim(),
      avatar,
      gpa: computedGpa,
      conductScore: Number(conductScore),
      grades
    };

    if (mode === 'add') {
      await addStudent(finalStudentData);
    } else {
      if (student) {
        await updateStudent({
          ...finalStudentData,
          activities: student.activities // preserve activities
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animation-fadeIn">
      <div className="bg-bg-secondary border border-border-color rounded-3xl w-full max-w-[800px] max-h-[90vh] shadow-lg flex flex-col overflow-hidden animation-scaleUp">
        <div className="p-5 border-b border-border-color flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-text-primary font-title">
            {mode === 'add' ? 'Thêm mới sinh viên' : 'Chỉnh sửa thông tin sinh viên'}
          </h3>
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:bg-input-bg hover:text-text-primary transition-all duration-200 cursor-pointer" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Personal Information */}
              <PersonalFields 
                id={id}
                setId={setId}
                name={name}
                setName={setName}
                gender={gender}
                setGender={setGender}
                dob={dob}
                setDob={setDob}
                errors={errors}
                isEditMode={mode === 'edit'}
              />

              {/* Contact Information */}
              <ContactFields 
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                address={address}
                setAddress={setAddress}
                errors={errors}
              />

              {/* Academic Registration */}
              <AcademicFields 
                department={department}
                className={className}
                setClassName={setClassName}
                status={status}
                setStatus={setStatus}
                avatar={avatar}
                setAvatar={setAvatar}
                handleDeptChange={handleDeptChange}
              />

              {/* Dynamic Grades Table */}
              <GradeEntryFields 
                grades={grades}
                setGrades={setGrades}
                subjects={subjects}
              />

              {errors.grades && (
                <div className="col-span-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-[#ef4444]">
                  {errors.grades}
                </div>
              )}

              {/* Điểm rèn luyện */}
              <div className="col-span-full grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                    <Award size={14} className="text-secondary" />
                    Điểm rèn luyện (0 - 100) *
                  </label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={conductScore}
                    onChange={(e) => setConductScore(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary"
                    placeholder="Ví dụ: 85"
                  />
                  {errors.conductScore && <span className="text-[10px] text-[#ef4444] font-medium">{errors.conductScore}</span>}
                </div>
                
                {/* Ghi chú */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Ghi chú học tập / Nhận xét khác</label>
                  <input 
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Đặc điểm học lực, giải thưởng đạt được..."
                    className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all duration-200"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="p-5 border-t border-border-color flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              className="h-11 px-5 rounded-xl font-semibold bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer text-sm" 
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="h-11 px-5 rounded-xl font-semibold bg-accent-gradient text-white hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm animate-pulse"
            >
              {mode === 'add' ? 'Lưu sinh viên' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
