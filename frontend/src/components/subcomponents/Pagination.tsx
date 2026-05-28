import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(totalItems, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-color">
      <span className="text-xs sm:text-sm text-text-secondary">
        Hiển thị <strong className="font-semibold text-text-primary">{startRange}</strong> đến{' '}
        <strong className="font-semibold text-text-primary">{endRange}</strong> trong tổng số{' '}
        <strong className="font-semibold text-text-primary">{totalItems}</strong> sinh viên
      </span>

      <div className="flex gap-2">
        <button 
          className="w-9 h-9 rounded-lg border border-border-color bg-bg-secondary text-text-primary flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-input-bg hover:enabled:border-text-muted" 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            className={`min-w-[36px] h-9 px-2 rounded-lg border flex items-center justify-center cursor-pointer font-medium text-xs sm:text-sm transition-all duration-200 ${
              currentPage === page 
                ? 'bg-accent-gradient text-white border-transparent shadow-sm' 
                : 'border-border-color bg-bg-secondary text-text-primary hover:bg-input-bg hover:border-text-muted'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button 
          className="w-9 h-9 rounded-lg border border-border-color bg-bg-secondary text-text-primary flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-input-bg hover:enabled:border-text-muted" 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          title="Trang sau"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
