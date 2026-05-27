import React from 'react';

interface GradeEntryFieldsProps {
  scoreOop: number;
  setScoreOop: (val: number) => void;
  scoreDsa: number;
  setScoreDsa: (val: number) => void;
  scoreDb: number;
  setScoreDb: (val: number) => void;
  scoreMath: number;
  setScoreMath: (val: number) => void;
  scoreNet: number;
  setScoreNet: (val: number) => void;
  errors: Record<string, string>;
}

export const GradeEntryFields: React.FC<GradeEntryFieldsProps> = ({
  scoreOop,
  setScoreOop,
  scoreDsa,
  setScoreDsa,
  scoreDb,
  setScoreDb,
  scoreMath,
  setScoreMath,
  scoreNet,
  setScoreNet,
  errors,
}) => {
  return (
    <div className="col-span-full mt-4 p-4 rounded-2xl border border-border-color bg-input-bg/40">
      <div className="text-xs sm:text-sm font-bold text-text-primary mb-3 font-title">
        4. Nhập điểm môn học (Thang điểm 10 - Tự động quy đổi ra GPA 4.0)
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* OOP */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary truncate" title="Lập trình hướng đối tượng (OOP)">OOP</label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10"
            value={scoreOop}
            onChange={(e) => setScoreOop(Number(e.target.value))}
            className="w-full h-10 px-2 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-center text-sm focus:outline-none focus:border-input-focus-border"
          />
          {errors.oop && <span className="text-[10px] text-[#ef4444] font-medium">{errors.oop}</span>}
        </div>

        {/* DSA */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary truncate" title="Cấu trúc dữ liệu & giải thuật (DSA)">DSA</label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10"
            value={scoreDsa}
            onChange={(e) => setScoreDsa(Number(e.target.value))}
            className="w-full h-10 px-2 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-center text-sm focus:outline-none focus:border-input-focus-border"
          />
          {errors.dsa && <span className="text-[10px] text-[#ef4444] font-medium">{errors.dsa}</span>}
        </div>

        {/* DBMS */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary truncate" title="Cơ sở dữ liệu (DBMS)">Cơ sở dữ liệu</label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10"
            value={scoreDb}
            onChange={(e) => setScoreDb(Number(e.target.value))}
            className="w-full h-10 px-2 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-center text-sm focus:outline-none focus:border-input-focus-border"
          />
          {errors.db && <span className="text-[10px] text-[#ef4444] font-medium">{errors.db}</span>}
        </div>

        {/* Math */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary truncate" title="Toán rời rạc">Toán rời rạc</label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10"
            value={scoreMath}
            onChange={(e) => setScoreMath(Number(e.target.value))}
            className="w-full h-10 px-2 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-center text-sm focus:outline-none focus:border-input-focus-border"
          />
          {errors.math && <span className="text-[10px] text-[#ef4444] font-medium">{errors.math}</span>}
        </div>

        {/* Net */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary truncate" title="Mạng máy tính">Mạng máy tính</label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="10"
            value={scoreNet}
            onChange={(e) => setScoreNet(Number(e.target.value))}
            className="w-full h-10 px-2 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-center text-sm focus:outline-none focus:border-input-focus-border"
          />
          {errors.net && <span className="text-[10px] text-[#ef4444] font-medium">{errors.net}</span>}
        </div>
      </div>
    </div>
  );
};
