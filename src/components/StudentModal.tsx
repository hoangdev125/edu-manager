import React, { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import type { Student, Grade } from '../types/student';
import { departments, classes } from '../mockData';
import { X } from 'lucide-react';
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
  const { addStudent, updateStudent, students } = useStudents();

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

  // Individual Subject Scores
  const [scoreOop, setScoreOop] = useState<number>(8.0);
  const [scoreDsa, setScoreDsa] = useState<number>(8.0);
  const [scoreDb, setScoreDb] = useState<number>(8.0);
  const [scoreMath, setScoreMath] = useState<number>(8.0);
  const [scoreNet, setScoreNet] = useState<number>(8.0);

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

      // Load scores if available
      const oop = student.grades.find(g => g.subject === 'Lập trình hướng đối tượng')?.score ?? 8;
      const dsa = student.grades.find(g => g.subject === 'Cấu trúc dữ liệu và giải thuật')?.score ?? 8;
      const db = student.grades.find(g => g.subject === 'Cơ sở dữ liệu')?.score ?? 8;
      const math = student.grades.find(g => g.subject === 'Toán rời rạc')?.score ?? 8;
      const net = student.grades.find(g => g.subject === 'Mạng máy tính')?.score ?? 8;

      setScoreOop(oop);
      setScoreDsa(dsa);
      setScoreDb(db);
      setScoreMath(math);
      setScoreNet(net);
    } else {
      // Generate standard random placeholder image for new student
      const randomSeed = Math.floor(Math.random() * 1000);
      setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
      // Default department and class
      setDepartment(departments[0]);
      setClassName(classes[0]);
    }
  }, [mode, student]);

  // Handle department change to match default classes
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setDepartment(dept);
    if (dept === 'Công nghệ thông tin') setClassName('CNTT-01-K15');
    else if (dept === 'Kinh tế đối ngoại') setClassName('KTDN-02-K15');
    else if (dept === 'Điện tử viễn thông') setClassName('DTVT-01-K14');
    else if (dept === 'Ngôn ngữ Anh') setClassName('NNA-01-K15');
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

    // Validate grades
    const scoreVal = (val: number, fieldName: string) => {
      if (val < 0 || val > 10 || isNaN(val)) {
        tempErrors[fieldName] = 'Điểm số phải từ 0 đến 10';
      }
    };
    scoreVal(scoreOop, 'oop');
    scoreVal(scoreDsa, 'dsa');
    scoreVal(scoreDb, 'db');
    scoreVal(scoreMath, 'math');
    scoreVal(scoreNet, 'net');

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build grades list
    const grades: Grade[] = [
      { subject: 'Lập trình hướng đối tượng', score: Number(scoreOop) },
      { subject: 'Cấu trúc dữ liệu và giải thuật', score: Number(scoreDsa) },
      { subject: 'Cơ sở dữ liệu', score: Number(scoreDb) },
      { subject: 'Toán rời rạc', score: Number(scoreMath) },
      { subject: 'Mạng máy tính', score: Number(scoreNet) }
    ];

    // Compute GPA (out of 10, converted to 4.0 by multiplying by 0.4)
    const avgScore10 = grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
    const computedGpa = parseFloat(((avgScore10 / 10) * 4).toFixed(2));

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
      grades
    };

    if (mode === 'add') {
      addStudent(finalStudentData);
    } else {
      if (student) {
        updateStudent({
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
        <div className="p-5 border-b border-border-color flex items-center justify-between">
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

              {/* Grades Table */}
              <GradeEntryFields 
                scoreOop={scoreOop}
                setScoreOop={setScoreOop}
                scoreDsa={scoreDsa}
                setScoreDsa={setScoreDsa}
                scoreDb={scoreDb}
                setScoreDb={setScoreDb}
                scoreMath={scoreMath}
                setScoreMath={setScoreMath}
                scoreNet={scoreNet}
                setScoreNet={setScoreNet}
                errors={errors}
              />

              {/* Ghi chú */}
              <div className="col-span-full flex flex-col gap-1.5 mt-4">
                <label className="text-xs font-semibold text-text-secondary">Ghi chú học tập / Nhận xét của giáo viên</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Đặc điểm học lực, kỷ luật, giải thưởng đạt được..."
                  className="w-full min-h-[80px] p-3 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all duration-200"
                />
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
              className="h-11 px-5 rounded-xl font-semibold bg-accent-gradient text-white hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm"
            >
              {mode === 'add' ? 'Lưu sinh viên' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
