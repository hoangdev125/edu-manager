import React from 'react';
import { fileApi } from '../../api';
import { useStudents } from '../../context/StudentContext';
import type { Student } from '../../types/student';

interface AcademicFieldsProps {
  department: string;
  className: string;
  setClassName: (val: string) => void;
  status: Student['status'];
  setStatus: (val: Student['status']) => void;
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
  const { departments, classes } = useStudents();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file ảnh.');
      return;
    }

    try {
      setIsUploading(true);
      const response = await fileApi.uploadAvatar(file);
      setAvatar(response.url);
    } catch {
      setUploadError('Không thể upload ảnh. Kiểm tra backend đã chạy chưa.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <>
      <h4 className="col-span-full border-b border-border-color pb-2 mt-4 mb-1 font-bold text-primary text-base font-title">
        3. Đăng ký Học tập & Trạng thái
      </h4>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Khoa / Ban ngành *</label>
        <select
          value={department}
          onChange={handleDeptChange}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Lớp sinh hoạt *</label>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
        >
          {classes
            .filter((cls) => !department || cls.departmentName === department)
            .map((cls) => (
              <option key={cls.id} value={cls.code}>{cls.code}</option>
            ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Trạng thái học tập *</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Student['status'])}
          className="w-full h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer"
        >
          <option value="Đang học">Đang học</option>
          <option value="Bảo lưu">Bảo lưu</option>
          <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">Ảnh đại diện</label>
        <div className="flex items-center gap-3">
          <img
            src={avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=student'}
            alt="Avatar preview"
            className="w-11 h-11 rounded-full object-cover border border-border-color bg-input-bg shrink-0"
          />
          <label className="h-11 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary text-sm font-semibold inline-flex items-center justify-center cursor-pointer hover:bg-bg-secondary transition-colors">
            {isUploading ? 'Đang upload...' : 'Chọn ảnh'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          {avatar && (
            <button
              type="button"
              onClick={() => setAvatar('')}
              className="h-11 px-3 rounded-xl border border-border-color bg-bg-secondary text-text-secondary text-xs font-semibold hover:bg-input-bg cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>
        {uploadError && <span className="text-xs font-semibold text-[#ef4444]">{uploadError}</span>}
      </div>
    </>
  );
};
