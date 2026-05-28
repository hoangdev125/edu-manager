import React from 'react';

interface ProfileHeaderProps {
  name: string;
  id: string;
  status: string;
  avatar: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, id, status, avatar }) => {
  const getStatusClass = (statusStr: string) => {
    if (statusStr === 'Đang học') return 'bg-[rgba(16,185,129,0.15)] text-[#059669]';
    if (statusStr === 'Bảo lưu') return 'bg-[rgba(245,158,11,0.15)] text-[#d97706]';
    return 'bg-[rgba(59,130,246,0.15)] text-[#2563eb]';
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-input-bg/40 border border-border-color mb-6">
      <img 
        src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`} 
        alt={name} 
        className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-sm bg-bg-secondary"
      />
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-extrabold text-text-primary font-title">{name}</h2>
        <div className="text-xs font-bold text-text-muted mt-1 tracking-wider">MÃ SỐ SINH VIÊN: {id}</div>
        <div className="mt-3">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
