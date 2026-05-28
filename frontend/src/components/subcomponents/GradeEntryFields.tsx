import React from 'react';
import type { Grade, SubjectOption } from '../../types/student';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface GradeEntryFieldsProps {
  grades: Grade[];
  setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
  subjects: SubjectOption[];
}

export const GradeEntryFields: React.FC<GradeEntryFieldsProps> = ({
  grades,
  setGrades,
  subjects,
}) => {
  const addGradeRow = () => {
    const firstSubject = subjects[0];
    const newGrade: Grade = {
      subjectCode: firstSubject ? firstSubject.code : 'INT1306',
      subjectName: firstSubject ? firstSubject.name : 'Lập trình hướng đối tượng',
      semester: 'Học kỳ I - 2025-2026',
      attendanceScore: 8.0,
      midtermScore: 8.0,
      finalScore: 8.0,
      attendanceWeight: 10,
      midtermWeight: 30,
      finalWeight: 60,
      score: 8.0
    };
    setGrades(prev => [...prev, newGrade]);
  };

  const removeGradeRow = (index: number) => {
    setGrades(prev => prev.filter((_, i) => i !== index));
  };

  const updateGradeField = (index: number, field: keyof Grade, value: any) => {
    setGrades(prev =>
      prev.map((g, i) => {
        if (i !== index) return g;
        const updated = { ...g, [field]: value };
        
        // Auto-recalculate score when scores or weights change
        if (
          field === 'attendanceScore' ||
          field === 'midtermScore' ||
          field === 'finalScore' ||
          field === 'attendanceWeight' ||
          field === 'midtermWeight' ||
          field === 'finalWeight'
        ) {
          const att = Number(updated.attendanceScore || 0);
          const mid = Number(updated.midtermScore || 0);
          const fin = Number(updated.finalScore || 0);
          const wAtt = Number(updated.attendanceWeight || 0);
          const wMid = Number(updated.midtermWeight || 0);
          const wFin = Number(updated.finalWeight || 0);

          const raw = (att * wAtt + mid * wMid + fin * wFin) / 100.0;
          updated.score = Math.round(raw * 100.0) / 100.0;
        }
        return updated;
      })
    );
  };

  return (
    <div className="col-span-full mt-4 p-5 rounded-2xl border border-border-color bg-input-bg/30">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <div className="text-sm font-extrabold text-text-primary font-title flex items-center gap-1.5">
            <Calculator size={18} className="text-secondary animate-pulse" />
            Nhập điểm môn học & Học kỳ chi tiết
          </div>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Điểm tổng kết thang 10 = (Chuyên cần * % + Giữa kỳ * % + Cuối kỳ * %) / 100. Tự động quy đổi sang GPA 4.0.
          </p>
        </div>
        <button
          type="button"
          onClick={addGradeRow}
          disabled={subjects.length === 0}
          className="h-9 px-4 rounded-xl font-semibold bg-accent-gradient text-white text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus size={14} />
          Thêm đầu điểm môn học
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="p-3 text-center rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-[#ef4444] font-semibold">
          ⚠️ Hệ thống chưa có môn học nào. Vui lòng thêm môn học ở tab "Quản lý Môn học" trước.
        </div>
      )}

      {grades.length === 0 ? (
        subjects.length > 0 && (
          <div className="p-8 text-center rounded-xl border border-dashed border-border-color bg-bg-secondary/40 text-text-secondary text-xs">
            Chưa có môn học nào được đăng ký điểm. Hãy bấm "Thêm đầu điểm môn học" để bắt đầu nhập điểm.
          </div>
        )
      ) : (
        <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
          {grades.map((grade, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-border-color bg-bg-secondary flex flex-col gap-3 relative group"
            >
              {/* Row 1: Select Subject and Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-secondary">Môn học</label>
                  <select
                    value={grade.subjectCode}
                    onChange={(e) => {
                      const selected = subjects.find(s => s.code === e.target.value);
                      updateGradeField(index, 'subjectCode', e.target.value);
                      updateGradeField(index, 'subjectName', selected ? selected.name : '');
                    }}
                    className="h-10 px-3 rounded-lg border border-border-color bg-input-bg text-text-primary text-xs focus:outline-none focus:border-input-focus-border cursor-pointer w-full"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.code}>
                        [{sub.code}] {sub.name} ({sub.credits} tín chỉ)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-secondary">Học kỳ & Năm học</label>
                  <select
                    value={grade.semester}
                    onChange={(e) => updateGradeField(index, 'semester', e.target.value)}
                    className="h-10 px-3 rounded-lg border border-border-color bg-input-bg text-text-primary text-xs focus:outline-none focus:border-input-focus-border cursor-pointer w-full"
                  >
                    <option value="Học kỳ I - 2025-2026">Học kỳ I - 2025-2026</option>
                    <option value="Học kỳ II - 2025-2026">Học kỳ II - 2025-2026</option>
                    <option value="Học kỳ I - 2026-2027">Học kỳ I - 2026-2027</option>
                    <option value="Học kỳ II - 2026-2027">Học kỳ II - 2026-2027</option>
                    <option value="Học kỳ hè - 2025-2026">Học kỳ hè - 2025-2026</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Scores and Customizable Weights */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 items-end">
                {/* Attendance */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-secondary">Chuyên cần (Điểm / Trọng số %)</span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.attendanceScore}
                      onChange={(e) => updateGradeField(index, 'attendanceScore', Number(e.target.value))}
                      className="w-full h-9 rounded-lg border border-border-color bg-input-bg text-text-primary text-center text-xs focus:outline-none focus:border-input-focus-border"
                      placeholder="Điểm"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.attendanceWeight}
                      onChange={(e) => updateGradeField(index, 'attendanceWeight', Number(e.target.value))}
                      className="w-12 h-9 rounded-lg border border-border-color bg-input-bg/70 text-text-secondary text-center text-[10px] focus:outline-none focus:border-input-focus-border"
                      placeholder="%"
                    />
                  </div>
                </div>

                {/* Midterm */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-secondary">Giữa kỳ (Điểm / Trọng số %)</span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.midtermScore}
                      onChange={(e) => updateGradeField(index, 'midtermScore', Number(e.target.value))}
                      className="w-full h-9 rounded-lg border border-border-color bg-input-bg text-text-primary text-center text-xs focus:outline-none focus:border-input-focus-border"
                      placeholder="Điểm"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.midtermWeight}
                      onChange={(e) => updateGradeField(index, 'midtermWeight', Number(e.target.value))}
                      className="w-12 h-9 rounded-lg border border-border-color bg-input-bg/70 text-text-secondary text-center text-[10px] focus:outline-none focus:border-input-focus-border"
                      placeholder="%"
                    />
                  </div>
                </div>

                {/* Final */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-secondary">Cuối kỳ (Điểm / Trọng số %)</span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.finalScore}
                      onChange={(e) => updateGradeField(index, 'finalScore', Number(e.target.value))}
                      className="w-full h-9 rounded-lg border border-border-color bg-input-bg text-text-primary text-center text-xs focus:outline-none focus:border-input-focus-border"
                      placeholder="Điểm"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.finalWeight}
                      onChange={(e) => updateGradeField(index, 'finalWeight', Number(e.target.value))}
                      className="w-12 h-9 rounded-lg border border-border-color bg-input-bg/70 text-text-secondary text-center text-[10px] focus:outline-none focus:border-input-focus-border"
                      placeholder="%"
                    />
                  </div>
                </div>

                {/* Auto Calculated Score & Delete Button */}
                <div className="flex items-center justify-between col-span-3 sm:col-span-1 border-l border-border-color pl-3 sm:border-l sm:h-9 max-[640px]:mt-3 max-[640px]:pt-2 max-[640px]:border-t max-[640px]:border-l-0">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-text-muted">Tổng kết (Hệ 10)</span>
                    <span className="text-sm font-extrabold text-text-primary font-title">
                      {grade.score.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeGradeRow(index)}
                    className="p-2 rounded-lg bg-bg-secondary text-[#ef4444]/80 hover:text-white hover:bg-[#ef4444] transition-all duration-200 cursor-pointer border border-border-color shrink-0 ml-2"
                    title="Xóa đầu điểm"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Weight total check warning */}
              {grade.attendanceWeight + grade.midtermWeight + grade.finalWeight !== 100 && (
                <div className="text-[9px] text-[#ef4444] font-semibold">
                  ⚠️ Cảnh báo: Tổng trọng số các điểm thành phần hiện là {grade.attendanceWeight + grade.midtermWeight + grade.finalWeight}%, vui lòng điều chỉnh để tổng bằng 100%.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
