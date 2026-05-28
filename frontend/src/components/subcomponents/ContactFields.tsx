import React from 'react';

interface ContactFieldsProps {
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  errors: Record<string, string>;
}

export const ContactFields: React.FC<ContactFieldsProps> = ({
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  errors,
}) => {
  return (
    <>
      <h4 className="col-span-full border-b border-border-color pb-2 mt-4 mb-1 font-bold text-primary text-base font-title">
        2. Thông tin liên hệ
      </h4>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Email *</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@student.edu.vn"
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200"
        />
        {errors.email && <span className="text-xs text-[#ef4444] font-medium">{errors.email}</span>}
      </div>

      {/* Số điện thoại */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Số điện thoại *</label>
        <input 
          type="text" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ví dụ: 0987654321"
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200"
        />
        {errors.phone && <span className="text-xs text-[#ef4444] font-medium">{errors.phone}</span>}
      </div>

      {/* Địa chỉ */}
      <div className="col-span-full flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Địa chỉ cư trú *</label>
        <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố"
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-2 focus:ring-primary-glow/50 transition-all duration-200"
        />
        {errors.address && <span className="text-xs text-[#ef4444] font-medium">{errors.address}</span>}
      </div>
    </>
  );
};
