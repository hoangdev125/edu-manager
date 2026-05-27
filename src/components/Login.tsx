import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { School, User, Lock, Mail, CreditCard } from 'lucide-react';
import { departments, classes } from '../mockData';

export const Login: React.FC = () => {
  const { login, register, users } = useAuth();
  const { addStudent, students } = useStudents();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local student registration fields (simplified)
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [selectedClass, setSelectedClass] = useState(classes[0]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    if (dept === 'Công nghệ thông tin') setSelectedClass('CNTT-01-K15');
    else if (dept === 'Kinh tế đối ngoại') setSelectedClass('KTDN-02-K15');
    else if (dept === 'Điện tử viễn thông') setSelectedClass('DTVT-01-K14');
    else if (dept === 'Ngôn ngữ Anh') setSelectedClass('NNA-01-K15');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    const success = login(username.trim(), password);
    if (!success) {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim() || !fullName.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin đăng ký.');
      return;
    }

    if (username.trim().toLowerCase() === 'admin' && role === 'student') {
      setErrorMsg('Không thể đăng ký tài khoản sinh viên với tên đăng nhập admin.');
      return;
    }

    let generatedStudentId: string | undefined = undefined;

    if (role === 'student') {
      if (!email.trim()) {
        setErrorMsg('Vui lòng điền địa chỉ email để liên kết tài khoản sinh viên.');
        return;
      }

      // Check if email format is correct
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Email không đúng định dạng.');
        return;
      }

      // Generate a unique Student ID (MSSV) that is free-form (can be STU + random digits)
      let uniqueId = '';
      let isUnique = false;
      while (!isUnique) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        uniqueId = `STU${randNum}`;
        isUnique = !students.some(s => s.id === uniqueId) && !users.some(u => u.studentId === uniqueId);
      }

      generatedStudentId = uniqueId;

      // Add student profile into StudentContext
      addStudent({
        id: generatedStudentId,
        name: fullName.trim(),
        gender: 'Nam',
        dob: '2005-01-01',
        email: email.trim(),
        phone: '0900000000',
        address: 'Chưa cập nhật',
        department: selectedDept,
        className: selectedClass,
        gpa: 0,
        status: 'Đang học',
        grades: [
          { subject: 'Lập trình hướng đối tượng', score: 8.0 },
          { subject: 'Cấu trúc dữ liệu và giải thuật', score: 8.0 },
          { subject: 'Cơ sở dữ liệu', score: 8.0 },
          { subject: 'Toán rời rạc', score: 8.0 },
          { subject: 'Mạng máy tính', score: 8.0 }
        ],
        notes: 'Sinh viên vừa đăng ký tài khoản mới trên hệ thống.',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
      });
    }

    const registerSuccess = register(
      username.trim(),
      password,
      fullName.trim(),
      role,
      generatedStudentId
    );

    if (registerSuccess) {
      setSuccessMsg('Đăng ký tài khoản thành công! Hãy đăng nhập để tiếp tục.');
      setIsRegisterMode(false);
      // clear inputs
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
    } else {
      setErrorMsg('Tên đăng nhập này đã tồn tại trong hệ thống.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-lg flex flex-col hover:bg-card-hover-bg transition-all duration-300">

        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center text-white shadow-[0_4px_15px_var(--primary-glow)] mb-3">
            <School size={28} />
          </div>
          <h2 className="font-title text-2xl font-extrabold bg-accent-gradient bg-clip-text text-transparent">
            Edu Manager
          </h2>
          <p className="text-xs text-text-secondary mt-1">Hệ thống Quản lý Học vụ & Hồ sơ Sinh viên</p>
        </div>

        {/* Form Title */}
        <h3 className="font-title text-xl font-bold text-text-primary text-center mb-6">
          {isRegisterMode ? 'Đăng ký tài khoản mới' : 'Đăng nhập vào hệ thống'}
        </h3>

        {/* Messaging */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-semibold text-[#ef4444] text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl border border-green-500/20 bg-green-500/10 text-xs font-semibold text-status-active-text text-center">
            {successMsg}
          </div>
        )}

        {/* Forms */}
        {!isRegisterMode ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Tên đăng nhập / MSSV</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin hoặc mã sinh viên (ví dụ: SV001)"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu mặc định là 123"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-11 mt-2 rounded-xl font-bold bg-accent-gradient text-white shadow-[0_4px_15px_var(--primary-glow)] hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm"
            >
              Đăng nhập
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Họ và Tên *</label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Tên đăng nhập *</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Viết liền không dấu, ví dụ: nva"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Mật khẩu *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu tự chọn"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Vai trò đăng ký *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none cursor-pointer"
              >
                <option value="student">Sinh viên (Student)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>

            {role === 'student' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Email liên hệ *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3.5 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="username@student.edu.vn"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Khoa đăng ký *</label>
                  <select
                    value={selectedDept}
                    onChange={handleDeptChange}
                    className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none cursor-pointer"
                  >
                    {departments.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Lớp sinh hoạt *</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none cursor-pointer"
                  >
                    {classes.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="h-11 mt-2 rounded-xl font-bold bg-accent-gradient text-white shadow-[0_4px_15px_var(--primary-glow)] hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm shrink-0"
            >
              Đăng ký
            </button>
          </form>
        )}

        {/* Toggle link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-none"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            {isRegisterMode ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký tại đây'}
          </button>
        </div>

      </div>
    </div>
  );
};
