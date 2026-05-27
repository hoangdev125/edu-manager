import React from 'react';

interface PersonalFieldsProps {
  id: string;
  setId: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  gender: 'Nam' | 'Nữ' | 'Khác';
  setGender: (val: 'Nam' | 'Nữ' | 'Khác') => void;
  dob: string;
  setDob: (val: string) => void;
  errors: Record<string, string>;
  isEditMode: boolean;
}

export const PersonalFields: React.FC<PersonalFieldsProps> = ({
  id,
  setId,
  name,
  setName,
  gender,
  setGender,
  dob,
  setDob,
  errors,
  isEditMode,
}) => {
  return (
    <>
      <h4 className="col-span-full border-b border-border-color pb-2 mt-2 mb-1 font-bold text-primary text-base font-title">
        1. Thông tin cá nhân
      </h4>

      {/* MSSV */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Mã số sinh viên (MSSV) *</label>
        <input 
          type="text" 
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={isEditMode}
          placeholder="Ví dụ: 2026CSE01 hoặc SV011"
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
        />
        {errors.id && <span className="text-xs text-[#ef4444] font-medium">{errors.id}</span>}
      </div>

      {/* Họ tên */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Họ và Tên *</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Nguyễn Văn A"
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200"
        />
        {errors.name && <span className="text-xs text-[#ef4444] font-medium">{errors.name}</span>}
      </div>

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
        <input 
          type="date" 
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200"
        />
        {errors.dob && <span className="text-xs text-[#ef4444] font-medium">{errors.dob}</span>}
      </div>
    </>
  );
};
