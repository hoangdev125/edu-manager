import React, { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import type { Student, Grade } from '../types/student';
import { departments, classes } from '../mockData';
import { X } from 'lucide-react';

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

  // Handle department change to match default classes (optional visual helper)
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setDepartment(dept);
    // Auto shift class prefix to match department for nice demo data
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
      } else if (!/^SV\d{3,5}$/i.test(id.trim())) {
        tempErrors.id = 'MSSV phải có dạng SVxxx (Ví dụ: SV011)';
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
    const scoreVal = (val: number, name: string) => {
      if (val < 0 || val > 10 || isNaN(val)) {
        tempErrors[name] = 'Điểm số phải từ 0 đến 10';
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

    // Compute GPA (out of 4.0 system for simplicity, normalized from 10 points)
    // Avg out of 10, then convert to 4.0 scale by multiplying by 0.4
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
    <div className="modal-overlay">
      <div className="modal-window">
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === 'add' ? 'Thêm mới sinh viên' : 'Chỉnh sửa thông tin sinh viên'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div className="modal-body">
            <div className="form-grid">
              
              {/* Profile details section */}
              <h4 className="form-group full-width" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', color: 'var(--primary)' }}>
                1. Thông tin cá nhân
              </h4>

              {/* MSSV */}
              <div className="form-group">
                <label className="form-label">Mã số sinh viên (MSSV) *</label>
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={mode === 'edit'}
                  placeholder="Ví dụ: SV011"
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.id && <span className="error-text">{errors.id}</span>}
              </div>

              {/* Họ tên */}
              <div className="form-group">
                <label className="form-label">Họ và Tên *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="form-input"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Giới tính */}
              <div className="form-group">
                <label className="form-label">Giới tính *</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value as any)}
                  className="form-input"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Ngày sinh */}
              <div className="form-group">
                <label className="form-label">Ngày sinh *</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-input"
                />
                {errors.dob && <span className="error-text">{errors.dob}</span>}
              </div>

              {/* Contact section */}
              <h4 className="form-group full-width" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '12px', marginBottom: '8px', color: 'var(--primary)' }}>
                2. Thông tin liên hệ
              </h4>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@student.edu.vn"
                  className="form-input"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label className="form-label">Số điện thoại *</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0987654321"
                  className="form-input"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Địa chỉ */}
              <div className="form-group full-width">
                <label className="form-label">Địa chỉ cư trú *</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố"
                  className="form-input"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              {/* Academic section */}
              <h4 className="form-group full-width" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '12px', marginBottom: '8px', color: 'var(--primary)' }}>
                3. Đăng ký Học tập & Trạng thái
              </h4>

              {/* Khoa */}
              <div className="form-group">
                <label className="form-label">Khoa / Ban ngành *</label>
                <select 
                  value={department} 
                  onChange={handleDeptChange}
                  className="form-input"
                >
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Lớp */}
              <div className="form-group">
                <label className="form-label">Lớp sinh hoạt *</label>
                <select 
                  value={className} 
                  onChange={(e) => setClassName(e.target.value)}
                  className="form-input"
                >
                  {classes.map((cls, idx) => (
                    <option key={idx} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Trạng thái */}
              <div className="form-group">
                <label className="form-label">Trạng thái học tập *</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="form-input"
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                </select>
              </div>

              {/* Link ảnh đại diện (nếu muốn thay đổi) */}
              <div className="form-group">
                <label className="form-label">Đường dẫn ảnh đại diện (URL)</label>
                <input 
                  type="text" 
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="form-input"
                />
              </div>

              {/* Điểm học tập các môn */}
              <div className="form-group full-width" style={{ marginTop: '12px' }}>
                <div className="grades-entry-container">
                  <div className="grades-entry-title">4. Nhập điểm môn học (Thang điểm 10 - Hệ thống sẽ tự quy đổi ra GPA 4.0)</div>
                  <div className="grades-grid">
                    <div className="form-group" style={{ gap: '4px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Lập trình hướng đối tượng (OOP)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10"
                        value={scoreOop}
                        onChange={(e) => setScoreOop(Number(e.target.value))}
                        className="form-input"
                        style={{ height: '38px' }}
                      />
                      {errors.oop && <span className="error-text">{errors.oop}</span>}
                    </div>

                    <div className="form-group" style={{ gap: '4px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Cấu trúc dữ liệu & giải thuật (DSA)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10"
                        value={scoreDsa}
                        onChange={(e) => setScoreDsa(Number(e.target.value))}
                        className="form-input"
                        style={{ height: '38px' }}
                      />
                      {errors.dsa && <span className="error-text">{errors.dsa}</span>}
                    </div>

                    <div className="form-group" style={{ gap: '4px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Cơ sở dữ liệu (DBMS)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10"
                        value={scoreDb}
                        onChange={(e) => setScoreDb(Number(e.target.value))}
                        className="form-input"
                        style={{ height: '38px' }}
                      />
                      {errors.db && <span className="error-text">{errors.db}</span>}
                    </div>

                    <div className="form-group" style={{ gap: '4px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Toán rời rạc</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10"
                        value={scoreMath}
                        onChange={(e) => setScoreMath(Number(e.target.value))}
                        className="form-input"
                        style={{ height: '38px' }}
                      />
                      {errors.math && <span className="error-text">{errors.math}</span>}
                    </div>

                    <div className="form-group" style={{ gap: '4px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Mạng máy tính</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10"
                        value={scoreNet}
                        onChange={(e) => setScoreNet(Number(e.target.value))}
                        className="form-input"
                        style={{ height: '38px' }}
                      />
                      {errors.net && <span className="error-text">{errors.net}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="form-group full-width" style={{ marginTop: '12px' }}>
                <label className="form-label">Ghi chú học tập / Nhận xét của giáo viên</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Đặc điểm học lực, kỷ luật, giải thưởng đạt được..."
                  className="form-textarea"
                />
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'add' ? 'Lưu sinh viên' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
