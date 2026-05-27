import React from 'react';
import { departments, classes } from '../../mockData';

interface AcademicFieldsProps {
  department: string;
  className: string;
  setClassName: (val: string) => void;
  status: 'Đang học' | 'Bảo lưu' | 'Đã tốt nghiệp';
  setStatus: (val: 'Đang học' | 'Bảo lưu' | 'Đã tốt nghiệp') => void;
  avatar: string;
  setAvatar: (val: string) => void;
  handleDeptChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const AcademicFields: React.FC<AcademicFieldsProps> = ({
  department,
  className,
  setClassName,
  status,
  setStatus,
  avatar,
  setAvatar,
  handleDeptChange,
}) => {
  return (
    <>
      <h4 className="col-span-full border-b border-border-color pb-2 mt-4 mb-1 font-bold text-primary text-base font-title font-title">
        3. Đăng ký Học tập & Trạng thái
      </h4>

      {/* Khoa */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Khoa / Ban ngành *</label>
        <select 
          value={department} 
          onChange={handleDeptChange}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
        >
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Lớp */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Lớp sinh hoạt *</label>
        <select 
          value={className} 
          onChange={(e) => setClassName(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
        >
          {classes.map((cls, idx) => (
            <option key={idx} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Trạng thái */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Trạng thái học tập *</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
        >
          <option value="Đang học">Đang học</option>
          <option value="Bảo lưu">Bảo lưu</option>
          <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
        </select>
      </div>

      {/* Link ảnh đại diện */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Đường dẫn ảnh đại diện (URL)</label>
        <input 
          type="text" 
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200"
        />
      </div>
    </>
  );
};
