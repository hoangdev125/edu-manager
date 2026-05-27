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
    <div className="pagination">
      <span className="pagination-info">
        Hiển thị <strong>{startRange}</strong> đến{' '}
        <strong>{endRange}</strong> trong tổng số{' '}
        <strong>{totalItems}</strong> sinh viên
      </span>

      <div className="pagination-buttons">
        <button 
          className="page-btn" 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button 
          className="page-btn" 
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
