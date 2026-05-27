import React from 'react';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';
import type { Student } from '../../types/student';

interface StudentTableProps {
  students: Student[];
  sortField: 'name' | 'id' | 'gpa';
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'name' | 'id' | 'gpa') => void;
  onView: (id: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
}) => {
  const renderSortIcon = (field: 'name' | 'id' | 'gpa') => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="inline opacity-40 ml-1" />;
    }
    return sortDirection === 'asc' 
      ? <span className="inline-block ml-1 text-primary text-xs">▲</span>
      : <span className="inline-block ml-1 text-primary text-xs">▼</span>;
  };

  const getGpaClass = (gpa: number) => {
    if (gpa >= 3.6) return 'bg-[rgba(16,185,129,0.15)] text-[#10b981]';
    if (gpa >= 3.2) return 'bg-[rgba(99,102,241,0.15)] text-[#6366f1]';
    if (gpa >= 2.5) return 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]';
    return 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]';
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.6) return 'Xuất sắc';
    if (gpa >= 3.2) return 'Khá';
    if (gpa >= 2.5) return 'T.Bình';
    return 'Yếu';
  };

  const getStatusClass = (status: string) => {
    if (status === 'Đang học') return 'bg-[rgba(16,185,129,0.15)] text-[#059669]';
    if (status === 'Bảo lưu') return 'bg-[rgba(245,158,11,0.15)] text-[#d97706]';
    return 'bg-[rgba(59,130,246,0.15)] text-[#2563eb]';
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-card-border bg-card-bg backdrop-blur-[20px] shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-text-primary">
        <thead>
          <tr className="bg-input-bg border-b border-border-color">
            <th className="p-4 font-semibold text-text-secondary cursor-pointer hover:text-text-primary select-none w-[120px]" onClick={() => onSort('id')}>
              <div className="flex items-center gap-1">
                MSSV {renderSortIcon('id')}
              </div>
            </th>
            <th className="p-4 font-semibold text-text-secondary cursor-pointer hover:text-text-primary select-none" onClick={() => onSort('name')}>
              <div className="flex items-center gap-1">
                Họ và Tên {renderSortIcon('name')}
              </div>
            </th>
            <th className="p-4 font-semibold text-text-secondary">Lớp học / Khoa</th>
            <th className="p-4 font-semibold text-text-secondary cursor-pointer hover:text-text-primary select-none w-[120px]" onClick={() => onSort('gpa')}>
              <div className="flex items-center gap-1">
                GPA {renderSortIcon('gpa')}
              </div>
            </th>
            <th className="p-4 font-semibold text-text-secondary w-[150px]">Trạng thái</th>
            <th className="p-4 font-semibold text-text-secondary w-[160px] text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-[rgba(99,102,241,0.03)] transition-colors duration-200">
              <td className="p-4 font-semibold text-primary">{student.id}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`} 
                    alt={student.name} 
                    className="w-10 h-10 rounded-full object-cover border border-border-color bg-input-bg"
                  />
                  <div>
                    <div className="font-semibold font-title text-text-primary text-sm">{student.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">{student.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="font-medium text-text-primary text-sm">{student.className}</div>
                <div className="text-xs text-text-muted mt-0.5">{student.department}</div>
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-bold text-xs ${getGpaClass(student.gpa)}`}>
                  {student.gpa.toFixed(2)} - {getGpaLabel(student.gpa)}
                </span>
              </td>
              <td className="p-4">
                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(student.status)}`}>
                  {student.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2 justify-center">
                  <button 
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer" 
                    title="Xem chi tiết"
                    onClick={() => onView(student.id)}
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-secondary border border-border-color text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer" 
                    title="Chỉnh sửa"
                    onClick={() => onEdit(student)}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-secondary border border-border-color text-[#ef4444] hover:bg-input-bg transition-colors duration-200 cursor-pointer" 
                    title="Xóa sinh viên"
                    onClick={() => onDelete(student)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
