import React from 'react';
import { useStudents } from '../context/StudentContext';
import { 
  X, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  BookOpen,
  History,
  FileText,
  Bookmark,
  Award
} from 'lucide-react';

interface StudentDetailProps {
  studentId: string;
  onClose: () => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ studentId, onClose }) => {
  const { getStudentById } = useStudents();
  const student = getStudentById(studentId);

  if (!student) {
    return (
      <div className="modal-overlay">
        <div className="modal-window small">
          <div className="modal-header">
            <h3 className="modal-title">Lỗi dữ liệu</h3>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body">
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
    if (gpa >= 3.6) return 'excellent';
    if (gpa >= 3.2) return 'good';
    if (gpa >= 2.5) return 'average';
    return 'poor';
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.6) return 'Xuất sắc';
    if (gpa >= 3.2) return 'Khá';
    if (gpa >= 2.5) return 'Trung bình';
    return 'Yếu';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} style={{ color: 'var(--primary)' }} />
            Hồ sơ học vụ chi tiết
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Profile Hero section */}
          <div className="profile-hero">
            <img 
              src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`} 
              alt={student.name} 
              className="profile-avatar"
            />
            <div className="profile-meta-info">
              <div className="profile-name">{student.name}</div>
              <div className="profile-mssv">MÃ SỐ SINH VIÊN: {student.id}</div>
              <div style={{ marginTop: '8px' }}>
                <span className={`status-badge ${student.status.toLowerCase().replace(' ', '-')}`}>
                  {student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details split grid */}
          <div className="profile-details-grid">
            
            {/* Left side: Personal & contact info */}
            <div>
              <h4 className="profile-section-title">
                <Bookmark size={16} />
                Thông tin cá nhân & liên lạc
              </h4>
              
              <div className="info-item">
                <span className="info-label"><Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Ngày sinh</span>
                <span className="info-value">{formatBirthdate(student.dob)}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><User size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Giới tính</span>
                <span className="info-value">{student.gender}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><BookOpen size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Khoa ban</span>
                <span className="info-value">{student.department}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><Bookmark size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Lớp sinh hoạt</span>
                <span className="info-value">{student.className}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><Mail size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Email</span>
                <span className="info-value" style={{ fontSize: '13px' }}>{student.email}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><Phone size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Điện thoại</span>
                <span className="info-value">{student.phone}</span>
              </div>

              <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="info-label"><MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} /> Địa chỉ cư trú</span>
                <span className="info-value" style={{ fontWeight: 500, fontSize: '13px', textAlign: 'left', marginTop: '2px' }}>{student.address}</span>
              </div>
            </div>

            {/* Right side: Academic scores */}
            <div>
              <h4 className="profile-section-title">
                <Award size={16} />
                Bảng điểm & kết quả học lực
              </h4>

              <div className="grade-table-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>Điểm trung bình (GPA):</span>
                  <span className={`gpa-badge ${getGpaClass(student.gpa)}`} style={{ fontSize: '16px', padding: '6px 14px' }}>
                    {student.gpa.toFixed(2)} / 4.0 ({getGpaLabel(student.gpa)})
                  </span>
                </div>

                <div className="grade-row">
                  <span className="grade-subject">Lập trình hướng đối tượng (OOP)</span>
                  <span className="grade-score">{student.grades.find(g => g.subject === 'Lập trình hướng đối tượng')?.score.toFixed(1) || 'N/A'}</span>
                </div>
                
                <div className="grade-row">
                  <span className="grade-subject">Cấu trúc dữ liệu và giải thuật (DSA)</span>
                  <span className="grade-score">{student.grades.find(g => g.subject === 'Cấu trúc dữ liệu và giải thuật')?.score.toFixed(1) || 'N/A'}</span>
                </div>

                <div className="grade-row">
                  <span className="grade-subject">Cơ sở dữ liệu (DBMS)</span>
                  <span className="grade-score">{student.grades.find(g => g.subject === 'Cơ sở dữ liệu')?.score.toFixed(1) || 'N/A'}</span>
                </div>

                <div className="grade-row">
                  <span className="grade-subject">Toán rời rạc</span>
                  <span className="grade-score">{student.grades.find(g => g.subject === 'Toán rời rạc')?.score.toFixed(1) || 'N/A'}</span>
                </div>

                <div className="grade-row">
                  <span className="grade-subject">Mạng máy tính</span>
                  <span className="grade-score">{student.grades.find(g => g.subject === 'Mạng máy tính')?.score.toFixed(1) || 'N/A'}</span>
                </div>
              </div>

              {/* Remarks/Notes */}
              <div style={{ marginTop: '24px' }}>
                <h4 className="profile-section-title" style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <FileText size={14} />
                  Nhận xét từ giáo viên
                </h4>
                <div style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  fontStyle: student.notes ? 'normal' : 'italic'
                }}>
                  {student.notes || 'Chưa có ghi chú hoặc nhận xét nào đối với sinh viên này.'}
                </div>
              </div>
            </div>

          </div>

          {/* Timeline section */}
          <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 className="profile-section-title" style={{ fontSize: '15px' }}>
              <History size={16} />
              Lịch sử cập nhật hệ thống
            </h4>
            <div className="history-timeline">
              {student.activities.map((act) => (
                <div key={act.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-action">{act.action}</span>
                    <span className="timeline-time">{formatActivityTime(act.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
