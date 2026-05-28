import React, { useState, useEffect } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

interface StudentFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  selectedGpaRange: string;
  setSelectedGpaRange: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  onAddClick: () => void;
  onExportClick?: () => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDept,
  setSelectedDept,
  selectedClass,
  setSelectedClass,
  selectedGpaRange,
  setSelectedGpaRange,
  selectedStatus,
  setSelectedStatus,
  onAddClick,
  onExportClick,
}) => {
  const { departments, classes } = useStudents();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setSearchTerm]);

  // Sync with parent state if it gets reset
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const hasAnyFilter = localSearch || selectedDept || selectedClass || selectedGpaRange || selectedStatus;

  const handleReset = () => {
    setLocalSearch('');
    setSearchTerm('');
    setSelectedDept('');
    setSelectedClass('');
    setSelectedGpaRange('');
    setSelectedStatus('');
  };

  return (
    <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg hover:shadow-lg transition-all duration-300">
      {/* Top Search & Add row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative w-full sm:flex-1 min-w-[260px]">
          <Search size={20} className="absolute left-4 top-[14px] text-text-muted pointer-events-none" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sinh viên theo tên hoặc MSSV..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-color bg-input-bg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary focus:ring-3 focus:ring-primary-glow transition-all duration-200 text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          {onExportClick && (
            <button 
              type="button"
              onClick={onExportClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl font-semibold bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <Download size={18} />
              Xuất CSV
            </button>
          )}
          <button 
            onClick={onAddClick}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold bg-accent-gradient text-white shadow-[0_4px_15px_var(--primary-glow)] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <Plus size={18} />
            Thêm sinh viên
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-color pt-4">
        <div className="flex flex-wrap gap-3">
          {/* Dept Filter */}
          <select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer transition-all duration-200 text-sm"
          >
            <option value="">Tất cả các Khoa</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>

          {/* Class Filter */}
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer transition-all duration-200 text-sm"
          >
            <option value="">Tất cả lớp học</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.code}>{cls.code}</option>
            ))}
          </select>

          {/* GPA Filter */}
          <select 
            value={selectedGpaRange} 
            onChange={(e) => setSelectedGpaRange(e.target.value)}
            className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer transition-all duration-200 text-sm"
          >
            <option value="">Tất cả học lực (GPA)</option>
            <option value="excellent">Xuất sắc (&gt;= 3.6)</option>
            <option value="good">Khá (3.2 - 3.59)</option>
            <option value="average">Trung bình (2.5 - 3.19)</option>
            <option value="poor">Yếu (&lt; 2.5)</option>
          </select>

          {/* Status Filter */}
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-12 px-4 rounded-xl border border-border-color bg-input-bg text-text-primary focus:outline-none focus:border-input-focus-border focus:bg-bg-secondary cursor-pointer transition-all duration-200 text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Bảo lưu">Bảo lưu</option>
            <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
          </select>
        </div>

        {hasAnyFilter && (
          <button 
            onClick={handleReset}
            className="h-12 px-5 rounded-xl font-semibold bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-all duration-200 cursor-pointer text-sm"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
