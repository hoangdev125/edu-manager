import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { ProfileHeader } from './subcomponents/ProfileHeader';
import { AcademicInfoCard } from './subcomponents/AcademicInfoCard';
import { HistoryTimeline } from './subcomponents/HistoryTimeline';
import { User, Phone, Mail, MapPin, Calendar, Check } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const { getStudentById, updateStudent } = useStudents();

  const student = currentUser?.studentId ? getStudentById(currentUser.studentId) : undefined;

  // Editing form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) {
      setEmail(student.email);
      setPhone(student.phone);
      setAddress(student.address);
      setDob(student.dob);
      setGender(student.gender);
    }
  }, [student]);

  if (!student) {
    return (
      <div className="p-6 rounded-2xl bg-card-bg border border-card-border shadow-md text-center flex flex-col items-center justify-center py-12 gap-3">
        <User size={48} className="text-text-muted opacity-40 animate-pulse" />
        <h4 className="font-title font-bold text-base text-text-primary">Không tìm thấy hồ sơ liên kết</h4>
        <p className="text-xs text-text-secondary max-w-sm">Tài khoản này chưa được liên kết với hồ sơ sinh viên nào trong hệ thống. Vui lòng liên hệ Trưởng phòng Đào tạo.</p>
      </div>
    );
  }


  const formatActivityTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getGpaClass = (gpa: number) => {
    if (gpa >= 3.6) return 'bg-[rgba(16,185,129,0.15)] text-[#10b981]';
    if (gpa >= 3.2) return 'bg-[rgba(99,102,241,0.15)] text-[#6366f1]';
    if (gpa >= 2.5) return 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]';
    return 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]';
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.6) return 'Xuất sắc';
    if (gpa >= 3.2) return 'Khá';
    if (gpa >= 2.5) return 'Trung bình';
    return 'Yếu';
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!email.trim() || !phone.trim() || !address.trim() || !dob) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin cá nhân cần cập nhật.');
      return;
    }

    const updated: typeof student = {
      ...student,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      dob,
      gender
    };

    updateStudent(updated);
    setSuccessMsg('Cập nhật thông tin cá nhân của bạn thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Profile Header Card */}
      <ProfileHeader 
        name={student.name}
        id={student.id}
        status={student.status}
        avatar={student.avatar || ''}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form: Edit Contact/Personal Info */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-card-border bg-card-bg backdrop-blur-[20px] shadow-md hover:bg-card-hover-bg transition-all duration-300">
          <h4 className="flex items-center gap-2 font-bold text-text-primary text-base border-b border-border-color pb-4 mb-5 font-title">
            <User size={18} className="text-primary" />
            Cập nhật thông tin cá nhân & liên lạc
          </h4>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl border border-green-500/20 bg-green-500/10 text-xs font-semibold text-status-active-text text-center flex items-center justify-center gap-2">
              <Check size={14} />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-semibold text-[#ef4444] text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Giới tính */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Giới tính *</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Ngày sinh *</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Email *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@student.edu.vn"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Điện thoại *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary"
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="col-span-full flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Địa chỉ cư trú *</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-3.5 text-text-muted" />
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary"
                />
              </div>
            </div>

            <div className="col-span-full border-t border-border-color pt-4 mt-2 flex justify-between items-center text-xs text-text-muted">
              <span>* Một số thông tin học tập quan trọng (Lớp, Khoa, Điểm số) chỉ có thể được thay đổi bởi Admin.</span>
              <button 
                type="submit"
                className="h-10 px-5 rounded-xl font-semibold bg-accent-gradient text-white hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-xs"
              >
                Cập nhật thông tin
              </button>
            </div>

          </form>
        </div>

        {/* Right side: Academic scores */}
        <div className="lg:col-span-1">
          <AcademicInfoCard 
            gpa={student.gpa}
            grades={student.grades}
            notes={student.notes || ''}
            getGpaClass={getGpaClass}
            getGpaLabel={getGpaLabel}
          />
        </div>

      </div>

      {/* History Timeline */}
      <HistoryTimeline 
        activities={student.activities}
        formatActivityTime={formatActivityTime}
      />

    </div>
  );
};
