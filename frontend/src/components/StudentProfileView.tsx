import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { ProfileHeader } from './subcomponents/ProfileHeader';
import { AcademicInfoCard } from './subcomponents/AcademicInfoCard';
import { HistoryTimeline } from './subcomponents/HistoryTimeline';
import { User, Phone, Mail, MapPin, Calendar, Check, TrendingUp } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const { getStudentById, updateStudent, theme, subjects } = useStudents();

  const student = currentUser?.studentId ? getStudentById(currentUser.studentId) : undefined;

  // Editing form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (student) {
      setEmail(student.email);
      setPhone(student.phone);
      setAddress(student.address);
      setDob(student.dob);
      setGender(student.gender);
    }
  }, [student]);

  // GPA 10-scale to 4-scale conversion helper
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

  // Render GPA progression chart dynamically on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !student) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing & HD DPI screens
    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    const displayWidth = container ? container.clientWidth - 40 : 450;
    const displayHeight = 180;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    ctx.scale(dpr, dpr);

    const width = displayWidth;
    const height = displayHeight;

    ctx.clearRect(0, 0, width, height);

    // Group grades by semester
    const semGroups: Record<string, typeof student.grades> = {};
    (student.grades || []).forEach(g => {
      const sem = g.semester || 'Học kỳ I - 2025-2026';
      if (!semGroups[sem]) semGroups[sem] = [];
      semGroups[sem].push(g);
    });

    const sems = Object.keys(semGroups).sort();
    if (sems.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px var(--font-body)';
      ctx.textAlign = 'center';
      ctx.fillText('Chưa có dữ liệu học tập để hiển thị biểu đồ.', width / 2, height / 2);
      return;
    }

    // Compute credit-weighted GPA for each semester
    const gpas = sems.map(sem => {
      const semGrades = semGroups[sem];
      let weightedSum = 0;
      let totalCredits = 0;
      semGrades.forEach(g => {
        const matchingSubj = subjects.find(s => s.code.toLowerCase() === g.subjectCode.toLowerCase());
        const credits = matchingSubj ? matchingSubj.credits : 3; // default to 3
        weightedSum += convertTo4Scale(g.score) * credits;
        totalCredits += credits;
      });
      return totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0.0;
    });

    // Layout configuration
    const paddingLeft = 35;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 25;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    // Draw Y grid lines & Y labels (0.0 to 4.0)
    ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px var(--font-body)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yTicks = [0, 1, 2, 3, 4];
    yTicks.forEach(tick => {
      const y = paddingTop + graphHeight - (tick / 4) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      ctx.fillText(tick.toFixed(1), paddingLeft - 6, y);
    });

    // Draw X labels & compute positions
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xPositions: number[] = [];
    sems.forEach((sem, idx) => {
      const x = sems.length > 1
        ? paddingLeft + (idx / (sems.length - 1)) * graphWidth
        : paddingLeft + graphWidth / 2;
      xPositions.push(x);

      // Label abbreviation: e.g. "Học kỳ I - 2025-2026" -> "HKI (25-26)"
      const termSplit = sem.split(' - ');
      const termShort = termSplit[0].replace('Học kỳ ', 'HK');
      const yearShort = termSplit[1] ? `(${termSplit[1].replace('20', '').replace('-20', '-')})` : '';
      ctx.fillText(`${termShort} ${yearShort}`, x, height - paddingBottom + 6);
    });

    // Draw area fill under the line
    if (sems.length > 0) {
      ctx.beginPath();
      ctx.moveTo(xPositions[0], paddingTop + graphHeight);
      sems.forEach((_, idx) => {
        const x = xPositions[idx];
        const gpaVal = gpas[idx];
        const y = paddingTop + graphHeight - (gpaVal / 4) * graphHeight;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(xPositions[xPositions.length - 1], paddingTop + graphHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + graphHeight);
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(129, 140, 248, 0.25)');
        gradient.addColorStop(1, 'rgba(45, 212, 191, 0.01)');
      } else {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
        gradient.addColorStop(1, 'rgba(20, 184, 166, 0.01)');
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw main glowing curved line
    ctx.beginPath();
    sems.forEach((_, idx) => {
      const x = xPositions[idx];
      const gpaVal = gpas[idx];
      const y = paddingTop + graphHeight - (gpaVal / 4) * graphHeight;
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw markers and score text labels
    sems.forEach((_, idx) => {
      const x = xPositions[idx];
      const gpaVal = gpas[idx];
      const y = paddingTop + graphHeight - (gpaVal / 4) * graphHeight;

      // Outer glowing dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#6366f1';
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Value label on top
      ctx.fillStyle = theme === 'dark' ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 8.5px var(--font-body)';
      ctx.fillText(gpaVal.toFixed(2), x, y - 10);
    });

  }, [student, theme, subjects]);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
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

    await updateStudent(updated);
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

      {/* GPA Progression Chart Card */}
      <div className="p-5 rounded-2xl border border-card-border bg-card-bg/60 backdrop-blur-[20px] shadow-md hover:shadow-lg transition-all duration-300">
        <h4 className="flex items-center gap-2 font-bold text-text-primary text-sm border-b border-border-color pb-3 mb-4 font-title">
          <TrendingUp size={16} className="text-primary" />
          Tiến trình phát triển GPA học tập theo học kỳ (Hệ 4.0)
        </h4>
        <div className="flex justify-center items-center w-full py-1">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>

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

            <div className="col-span-full border-t border-border-color pt-4 mt-2 flex justify-between items-center text-xs text-text-muted flex-wrap gap-2">
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
            conductScore={student.conductScore}
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
