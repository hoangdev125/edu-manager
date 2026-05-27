import React from 'react';
import { Award, FileText } from 'lucide-react';
import type { Grade } from '../../types/student';

interface AcademicInfoCardProps {
  gpa: number;
  grades: Grade[];
  notes: string;
  getGpaClass: (gpa: number) => string;
  getGpaLabel: (gpa: number) => string;
}

export const AcademicInfoCard: React.FC<AcademicInfoCardProps> = ({
  gpa,
  grades,
  notes,
  getGpaClass,
  getGpaLabel
}) => {
  return (
    <div className="p-6 rounded-2xl border border-border-color bg-card-bg/20 flex flex-col gap-3">
      <h4 className="flex items-center gap-2 font-bold text-text-primary text-base border-b border-border-color pb-3 mb-1 font-title">
        <Award size={16} className="text-secondary" />
        Bảng điểm & kết quả học lực
      </h4>

      {/* GPA summary box */}
      <div className="flex justify-between items-center py-2.5 border-b border-border-color">
        <span className="font-bold text-sm text-text-primary">Điểm trung bình (GPA):</span>
        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-extrabold text-sm ${getGpaClass(gpa)}`}>
          {gpa.toFixed(2)} / 4.0 ({getGpaLabel(gpa)})
        </span>
      </div>

      {/* Individual subject grades */}
      <div className="flex flex-col">
        {grades.map((g, idx) => (
          <div key={idx} className="flex justify-between items-center py-2 border-b border-border-color/30 last:border-0 text-xs">
            <span className="text-text-secondary font-medium">{g.subject}</span>
            <span className="font-bold text-text-primary">{g.score.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Teacher remarks */}
      <div className="mt-4">
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
