import React from 'react';
import { Award, FileText, Calendar, BookOpen } from 'lucide-react';
import type { Grade } from '../../types/student';

interface AcademicInfoCardProps {
  gpa: number;
  conductScore?: number;
  grades: Grade[];
  notes: string;
  getGpaClass: (gpa: number) => string;
  getGpaLabel: (gpa: number) => string;
}

export const AcademicInfoCard: React.FC<AcademicInfoCardProps> = ({
  gpa,
  conductScore = 80,
  grades,
  notes,
  getGpaClass,
  getGpaLabel
}) => {
  // Group grades by semester
  const gradesBySemester = React.useMemo(() => {
    const groups: Record<string, Grade[]> = {};
    (grades || []).forEach(g => {
      const sem = g.semester || 'Học kỳ I - 2025-2026';
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(g);
    });
    return groups;
  }, [grades]);

  const getConductClass = (score: number) => {
    if (score >= 90) return 'bg-green-500/10 text-status-active-text border-green-500/20';
    if (score >= 80) return 'bg-primary/10 text-primary border-primary/20';
    if (score >= 65) return 'bg-[#fbbf24]/10 text-[#d97706] border-[#fbbf24]/20';
    return 'bg-red-500/10 text-[#ef4444] border-red-500/20';
  };

  const getConductLabel = (score: number) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    if (score >= 65) return 'Khá';
    if (score >= 50) return 'Trung bình';
    return 'Yếu';
  };

  return (
    <div className="p-6 rounded-2xl border border-border-color bg-card-bg/70 backdrop-blur-[20px] flex flex-col gap-4 shadow-md hover:bg-card-hover-bg transition-all duration-300">
      <h4 className="flex items-center gap-2 font-bold text-text-primary text-base border-b border-border-color pb-3 mb-1 font-title">
        <Award size={18} className="text-secondary" />
        Kết quả học tập & rèn luyện
      </h4>

      {/* GPA & Conduct Summary metrics */}
      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border-color">
        <div className="p-3 rounded-xl bg-input-bg/30 text-center border border-border-color/40">
          <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Học lực (GPA)</div>
          <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-lg font-extrabold text-xs ${getGpaClass(gpa)}`}>
            {gpa.toFixed(2)} ({getGpaLabel(gpa)})
          </span>
        </div>

        <div className="p-3 rounded-xl bg-input-bg/30 text-center border border-border-color/40">
          <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Rèn luyện (DRL)</div>
          <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-lg font-extrabold text-xs border ${getConductClass(conductScore)}`}>
            {conductScore} ({getConductLabel(conductScore)})
          </span>
        </div>
      </div>

      {/* Grouped Semester Grades */}
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1">
        {Object.keys(gradesBySemester).length === 0 ? (
          <div className="p-4 text-center rounded-xl bg-input-bg/20 text-xs text-text-muted italic border border-border-color/30">
            Chưa ghi nhận điểm số môn học nào.
          </div>
        ) : (
          Object.entries(gradesBySemester).map(([semesterName, semesterGrades]) => (
            <div key={semesterName} className="flex flex-col gap-1.5">
              {/* Semester header */}
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-text-secondary border-b border-border-color/20 pb-1 mt-1">
                <Calendar size={12} className="text-primary" />
                {semesterName}
              </div>

              {/* Grades in this semester */}
              <div className="flex flex-col gap-1.5 pl-1.5">
                {semesterGrades.map((g, idx) => (
                  <div key={idx} className="flex flex-col py-1.5 border-b border-border-color/10 last:border-0">
                    <div className="flex justify-between items-start text-xs gap-2">
                      <span className="text-text-primary font-bold line-clamp-1 flex items-center gap-1.5">
                        <BookOpen size={10} className="text-text-muted" />
                        {g.subjectName}
                      </span>
                      <span className="font-extrabold text-text-primary shrink-0">
                        {g.score.toFixed(1)}
                      </span>
                    </div>
                    {/* Sub component breakdown details */}
                    <div className="text-[9px] text-text-muted mt-0.5 flex flex-wrap gap-x-2">
                      <span>Mã: {g.subjectCode}</span>
                      <span>•</span>
                      <span>Chuyên cần: {g.attendanceScore} ({g.attendanceWeight}%)</span>
                      <span>•</span>
                      <span>Giữa kỳ: {g.midtermScore} ({g.midtermWeight}%)</span>
                      <span>•</span>
                      <span>Cuối kỳ: {g.finalScore} ({g.finalWeight}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Teacher remarks */}
      <div className="mt-2 pt-3 border-t border-border-color">
        <h5 className="flex items-center gap-2 text-xs font-bold text-text-primary mb-2 font-title">
          <FileText size={14} className="text-text-muted" /> Nhận xét từ giáo viên
        </h5>
        <div className={`p-3 rounded-xl border border-border-color text-xs text-text-secondary leading-relaxed bg-input-bg ${
          notes ? '' : 'italic text-text-muted'
        }`}>
          {notes || 'Chưa có ghi chú hoặc nhận xét nào đối với sinh viên này.'}
        </div>
      </div>
    </div>
  );
};
