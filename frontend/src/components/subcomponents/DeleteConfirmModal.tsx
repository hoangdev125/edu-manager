import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  studentName: string;
  studentId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  studentName,
  studentId,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animation-fadeIn">
      <div className="bg-bg-secondary border border-border-color rounded-3xl w-full max-w-[480px] shadow-lg flex flex-col overflow-hidden animation-scaleUp">
        <div className="p-5 border-b border-border-color flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">Xác nhận xóa</h3>
        </div>
        <div className="p-6 flex-1 text-sm text-text-primary leading-relaxed">
          <p>
            Bạn có chắc chắn muốn xóa sinh viên <strong className="font-semibold">{studentName}</strong> (MSSV: <strong className="font-semibold text-primary">{studentId}</strong>) ra khỏi hệ thống?
          </p>
          <p className="text-[#ef4444] text-xs mt-3 font-semibold bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="p-5 border-t border-border-color flex justify-end gap-3">
          <button 
            className="h-11 px-5 rounded-xl font-semibold bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer text-sm" 
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button 
            className="h-11 px-5 rounded-xl font-semibold bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors duration-200 cursor-pointer text-sm" 
            onClick={onConfirm}
          >
            Xóa bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
