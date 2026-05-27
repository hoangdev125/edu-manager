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
    <div className="flex flex-col gap-6">
      
      {/* Header and search bar */}
      <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:flex-1 min-w-[260px]">
            <Search size={20} className="absolute left-4 top-[14px] text-text-muted pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tìm kiếm lớp học hoặc khoa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-3 focus:ring-primary-glow transition-all duration-200 text-sm"
            />
          </div>
          <div>
            <span className="text-xs sm:text-sm text-text-secondary font-semibold">
              Đang hiển thị <strong className="font-bold text-text-primary">{filteredClasses.length}</strong> lớp học tuyển sinh
            </span>
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <div key={cls.code} className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-lg font-extrabold text-text-primary font-title mb-0.5">{cls.code}</div>
                <div className="text-xs text-text-secondary font-semibold">{cls.department}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border-color">
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                  <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                    <Users size={14} className="text-primary" />
                    {cls.studentCount}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">Sinh viên</div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                  <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                    <GraduationCap size={14} className="text-secondary" />
                    {cls.averageGpa > 0 ? cls.averageGpa.toFixed(2) : '0.00'}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">GPA TB</div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-input-bg/30 text-center">
                  <div className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1">
                    <Award size={14} className="text-[#fbbf24]" />
                    {cls.excellentCount}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 font-bold truncate w-full">Học sinh giỏi</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md flex items-center justify-center py-12">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <School size={48} className="text-text-muted opacity-40 animate-pulse" />
            <h4 className="font-title font-bold text-base text-text-primary">Không tìm thấy lớp học nào</h4>
            <p className="text-xs text-text-secondary">Hãy thử điều chỉnh từ khóa tìm kiếm của bạn.</p>
          </div>
        </div>
      )}

      {/* Summary report info */}
      <div className="p-6 rounded-2xl bg-accent-gradient text-white shadow-md flex flex-col gap-2 border-none">
        <h3 className="text-white text-base sm:text-lg font-bold font-title">Chính sách Đào tạo khóa mới</h3>
        <p className="opacity-90 text-xs sm:text-sm leading-relaxed">
          Tất cả các lớp học K15 và K16 đang áp dụng khung đào tạo chuẩn mới theo định dạng tín chỉ châu Âu (ECTS).
          Điểm GPA trung bình toàn lớp được cập nhật tự động khi có bất kỳ thay đổi nào về điểm số môn học của sinh viên trong hệ thống.
        </p>
      </div>
    </div>
  );
};
