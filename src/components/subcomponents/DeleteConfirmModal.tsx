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
    <div className="modal-overlay">
      <div className="modal-window small">
        <div className="modal-header">
          <h3 className="modal-title">Xác nhận xóa</h3>
        </div>
        <div className="modal-body">
          <p>
            Bạn có chắc chắn muốn xóa sinh viên <strong>{studentName}</strong> (MSSV: <strong>{studentId}</strong>) ra khỏi hệ thống?
          </p>
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontWeight: 500 }}>
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Xóa bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
