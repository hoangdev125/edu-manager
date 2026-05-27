import React from 'react';
import { Calendar, User, BookOpen, Bookmark, Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoCardProps {
  dob: string;
  gender: string;
  department: string;
  className: string;
  email: string;
  phone: string;
  address: string;
  formatBirthdate: (date: string) => string;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  dob,
  gender,
  department,
  className,
  email,
  phone,
  address,
  formatBirthdate,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-border-color bg-card-bg/20 flex flex-col gap-3">
      <h4 className="flex items-center gap-2 font-bold text-text-primary text-base border-b border-border-color pb-3 mb-1 font-title">
        <Bookmark size={16} className="text-primary" />
        Thông tin cá nhân & liên lạc
      </h4>
      
      {/* Ngày sinh */}
      <div className="flex justify-between items-center py-2 border-b border-border-color/40">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <Calendar size={14} className="text-text-muted" /> Ngày sinh
        </span>
        <span className="text-sm font-semibold text-text-primary">{formatBirthdate(dob)}</span>
      </div>

      {/* Giới tính */}
      <div className="flex justify-between items-center py-2 border-b border-border-color/40">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <User size={14} className="text-text-muted" /> Giới tính
        </span>
        <span className="text-sm font-semibold text-text-primary">{gender}</span>
      </div>

      {/* Khoa */}
      <div className="flex justify-between items-center py-2 border-b border-border-color/40">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <BookOpen size={14} className="text-text-muted" /> Khoa ban
        </span>
        <span className="text-sm font-semibold text-text-primary">{department}</span>
      </div>

      {/* Lớp sinh hoạt */}
      <div className="flex justify-between items-center py-2 border-b border-border-color/40">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <Bookmark size={14} className="text-text-muted" /> Lớp sinh hoạt
        </span>
        <span className="text-sm font-semibold text-text-primary">{className}</span>
      </div>

      {/* Email */}
      <div className="flex justify-between items-center py-2 border-b border-border-color/40">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <Mail size={14} className="text-text-muted" /> Email
        </span>
        <span className="text-xs font-semibold text-text-primary break-all max-w-[65%] text-right">{email}</span>
      </div>

      {/* Số điện thoại */}
      <div className="flex justify-between items-center py-2 border-b border-border-color/40">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <Phone size={14} className="text-text-muted" /> Điện thoại
        </span>
        <span className="text-sm font-semibold text-text-primary">{phone}</span>
      </div>

      {/* Địa chỉ */}
      <div className="flex flex-col gap-1 py-2">
        <span className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <MapPin size={14} className="text-text-muted" /> Địa chỉ cư trú
        </span>
        <span className="text-xs font-medium text-text-primary mt-1 text-left leading-relaxed">{address}</span>
      </div>
    </div>
  );
};
