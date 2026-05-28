import React from 'react';
import { useStudents } from '../context/StudentContext';
import { X, User, Printer } from 'lucide-react';
import { ProfileHeader } from './subcomponents/ProfileHeader';
import { ContactInfoCard } from './subcomponents/ContactInfoCard';
import { AcademicInfoCard } from './subcomponents/AcademicInfoCard';
import { HistoryTimeline } from './subcomponents/HistoryTimeline';

interface StudentDetailProps {
  studentId: string;
  onClose: () => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ studentId, onClose }) => {
  const { getStudentById } = useStudents();
  const student = getStudentById(studentId);

  if (!student) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animation-fadeIn">
        <div className="bg-bg-secondary border border-border-color rounded-3xl w-full max-w-[480px] shadow-lg flex flex-col overflow-hidden animation-scaleUp">
          <div className="p-5 border-b border-border-color flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Lỗi dữ liệu</h3>
            <button 
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:bg-input-bg hover:text-text-primary transition-all duration-200 cursor-pointer" 
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 text-sm text-text-primary">
            <p>Không tìm thấy sinh viên trong cơ sở dữ liệu.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatBirthdate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

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

  // GPA classification helper
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animation-fadeIn">
      <div className="bg-bg-secondary border border-border-color rounded-3xl w-full max-w-[800px] max-h-[90vh] shadow-lg flex flex-col overflow-hidden animation-scaleUp">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-border-color flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 font-title">
            <User size={20} className="text-primary" />
            Hồ sơ học vụ chi tiết
          </h3>
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:bg-input-bg hover:text-text-primary transition-all duration-200 cursor-pointer" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Profile Header */}
          <ProfileHeader 
            name={student.name}
            id={student.id}
            status={student.status}
            avatar={student.avatar || ''}
          />

          {/* Details split grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left side: Personal & contact info */}
            <ContactInfoCard 
              dob={student.dob}
              gender={student.gender}
              department={student.department}
              className={student.className}
              email={student.email}
              phone={student.phone}
              address={student.address}
              formatBirthdate={formatBirthdate}
            />

            {/* Right side: Academic scores */}
            <AcademicInfoCard 
              gpa={student.gpa}
              conductScore={student.conductScore}
              grades={student.grades}
              notes={student.notes || ''}
              getGpaClass={getGpaClass}
              getGpaLabel={getGpaLabel}
            />
          </div>

          {/* Timeline section */}
          <HistoryTimeline 
            activities={student.activities}
            formatActivityTime={formatActivityTime}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-border-color flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => window.print()}
            className="h-11 px-5 rounded-xl font-semibold bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer text-sm inline-flex items-center gap-2 print:hidden"
          >
            <Printer size={16} />
            In hồ sơ
          </button>
          <button 
            className="h-11 px-5 rounded-xl font-semibold bg-accent-gradient text-white hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm print:hidden" 
            onClick={onClose}
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
