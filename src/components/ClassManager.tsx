import React, { useState, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { classes } from '../mockData';
import { Users, GraduationCap, Award, Search, School } from 'lucide-react';

export const ClassManager: React.FC = () => {
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamically compute stats for each class
  const classStats = useMemo(() => {
    return classes.map(classCode => {
      // Find students in this class
      const classStudents = students.filter(s => s.className === classCode);
      const studentCount = classStudents.length;

      // Class average GPA
      const averageGpa = studentCount > 0
        ? parseFloat((classStudents.reduce((sum, s) => sum + s.gpa, 0) / studentCount).toFixed(2))
        : 0;

      // Count excellent students (GPA >= 3.6)
      const excellentCount = classStudents.filter(s => s.gpa >= 3.6).length;

      // Determine department based on first letter or class prefix
      let department = '';
      if (classCode.startsWith('CNTT')) department = 'Công nghệ thông tin';
      else if (classCode.startsWith('KTDN')) department = 'Kinh tế đối ngoại';
      else if (classCode.startsWith('DTVT')) department = 'Điện tử viễn thông';
      else if (classCode.startsWith('NNA')) department = 'Ngôn ngữ Anh';
      else department = 'Khoa học Cơ bản';

      return {
        code: classCode,
        department,
        studentCount,
        averageGpa,
        excellentCount
      };
    });
  }, [students]);

  // Filter classes based on search
  const filteredClasses = useMemo(() => {
    if (!searchTerm.trim()) return classStats;
    const term = searchTerm.toLowerCase();
    return classStats.filter(
      c => c.code.toLowerCase().includes(term) || c.department.toLowerCase().includes(term)
    );
  }, [classStats, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header and search bar */}
      <div className="glass-card">
        <div className="controls-row" style={{ marginBottom: 0 }}>
          <div className="search-wrapper">
            <Search size={20} className="search-icon-svg" />
            <input 
              type="text" 
              placeholder="Tìm kiếm lớp học hoặc khoa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Đang hiển thị <strong>{filteredClasses.length}</strong> lớp học tuyển sinh
            </span>
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      {filteredClasses.length > 0 ? (
        <div className="class-grid">
          {filteredClasses.map((cls) => (
            <div key={cls.code} className="glass-card class-card">
              <div className="class-header-title">{cls.code}</div>
              <div className="class-dept">{cls.department}</div>

              <div className="class-stats">
                <div className="class-stat-box">
                  <div className="class-stat-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} style={{ color: 'var(--primary)' }} />
                    {cls.studentCount}
                  </div>
                  <div className="class-stat-lbl">Sinh viên</div>
                </div>

                <div className="class-stat-box">
                  <div className="class-stat-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={16} style={{ color: 'var(--secondary)' }} />
                    {cls.averageGpa > 0 ? cls.averageGpa.toFixed(2) : '0.00'}
                  </div>
                  <div className="class-stat-lbl">GPA Trung bình</div>
                </div>

                <div className="class-stat-box">
                  <div className="class-stat-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} style={{ color: '#fbbf24' }} />
                    {cls.excellentCount}
                  </div>
                  <div className="class-stat-lbl">Học sinh giỏi</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card">
          <div className="empty-state">
            <School size={48} className="empty-state-icon" />
            <h4 className="empty-state-title">Không tìm thấy lớp học nào</h4>
            <p className="empty-state-desc">Hãy thử điều chỉnh từ khóa tìm kiếm của bạn.</p>
          </div>
        </div>
      )}

      {/* Summary report info */}
      <div className="glass-card" style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none' }}>
        <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Chính sách Đào tạo khóa mới</h3>
        <p style={{ opacity: 0.9, fontSize: '14px', lineHeight: '1.6' }}>
          Tất cả các lớp học K15 và K16 đang áp dụng khung đào tạo chuẩn mới theo định dạng tín chỉ châu Âu (ECTS).
          Điểm GPA trung bình toàn lớp được cập nhật tự động khi có bất kỳ thay đổi nào về điểm số môn học của sinh viên trong hệ thống.
        </p>
      </div>
    </div>
  );
};
