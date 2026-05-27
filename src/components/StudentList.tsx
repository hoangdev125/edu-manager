import React, { useState, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import type { Student } from '../types/student';
import { departments, classes } from '../mockData';
import { StudentModal } from './StudentModal';
import { StudentDetail } from './StudentDetail';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const StudentList: React.FC = () => {
  const { students, deleteStudent } = useStudents();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGpaRange, setSelectedGpaRange] = useState('');
  
  // Sorting state
  const [sortField, setSortField] = useState<'name' | 'id' | 'gpa'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailStudentId, setDetailStudentId] = useState<string | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // 1. Sort Handler
  const handleSort = (field: 'name' | 'id' | 'gpa') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 2. Filter & Search Logic
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search term (name or ID)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term)
      );
    }

    // Department filter
    if (selectedDept) {
      result = result.filter(s => s.department === selectedDept);
    }

    // Class filter
    if (selectedClass) {
      result = result.filter(s => s.className === selectedClass);
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter(s => s.status === selectedStatus);
    }

    // GPA filter
    if (selectedGpaRange) {
      result = result.filter(s => {
        if (selectedGpaRange === 'excellent') return s.gpa >= 3.6;
        if (selectedGpaRange === 'good') return s.gpa >= 3.2 && s.gpa < 3.6;
        if (selectedGpaRange === 'average') return s.gpa >= 2.5 && s.gpa < 3.2;
        if (selectedGpaRange === 'poor') return s.gpa < 2.5;
        return true;
      });
    }

    // Apply Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'vi');
      } else if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'gpa') {
        comparison = a.gpa - b.gpa;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [students, searchTerm, selectedDept, selectedClass, selectedStatus, selectedGpaRange, sortField, sortDirection]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedClass, selectedStatus, selectedGpaRange]);

  // 3. Pagination Logic
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // 4. Modal Triggers
  const openAddModal = () => {
    setModalMode('add');
    setSelectedStudent(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const openDetailModal = (id: string) => {
    setDetailStudentId(id);
    setIsDetailOpen(true);
  };

  const triggerDelete = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setIsDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  const getGpaClass = (gpa: number) => {
    if (gpa >= 3.6) return 'excellent';
    if (gpa >= 3.2) return 'good';
    if (gpa >= 2.5) return 'average';
    return 'poor';
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.6) return 'Xuất sắc';
    if (gpa >= 3.2) return 'Khá';
    if (gpa >= 2.5) return 'T.Bình';
    return 'Yếu';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card">
        {/* Controls Row */}
        <div className="controls-row">
          <div className="search-wrapper">
            <Search size={20} className="search-icon-svg" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sinh viên theo tên hoặc MSSV..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} />
              Thêm sinh viên
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="controls-row" style={{ marginTop: '-12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div className="filters-wrapper">
            {/* Dept Filter */}
            <select 
              value={selectedDept} 
              onChange={(e) => setSelectedDept(e.target.value)}
              className="select-filter"
            >
              <option value="">Tất cả các Khoa</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Class Filter */}
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select-filter"
            >
              <option value="">Tất cả lớp học</option>
              {classes.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>

            {/* GPA Filter */}
            <select 
              value={selectedGpaRange} 
              onChange={(e) => setSelectedGpaRange(e.target.value)}
              className="select-filter"
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
              className="select-filter"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Đang học">Đang học</option>
              <option value="Bảo lưu">Bảo lưu</option>
              <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
            </select>
          </div>

          {(selectedDept || selectedClass || selectedStatus || selectedGpaRange || searchTerm) && (
            <button 
              className="btn btn-secondary" 
              style={{ height: '48px' }}
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('');
                setSelectedClass('');
                setSelectedStatus('');
                setSelectedGpaRange('');
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Data Table */}
        {filteredStudents.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('id')} style={{ width: '120px' }}>
                      MSSV <ArrowUpDown size={14} style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                    </th>
                    <th className="sortable" onClick={() => handleSort('name')}>
                      Họ và Tên <ArrowUpDown size={14} style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                    </th>
                    <th>Lớp học / Khoa</th>
                    <th className="sortable" onClick={() => handleSort('gpa')} style={{ width: '120px' }}>
                      GPA <ArrowUpDown size={14} style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                    </th>
                    <th style={{ width: '150px' }}>Trạng thái</th>
                    <th style={{ width: '160px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr key={student.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{student.id}</td>
                      <td>
                        <div className="student-row-info">
                          <img 
                            src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`} 
                            alt={student.name} 
                            className="student-table-avatar"
                          />
                          <div>
                            <div className="student-name-text">{student.name}</div>
                            <div className="student-sub-text">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{student.className}</div>
                        <div className="student-sub-text" style={{ fontSize: '11px' }}>{student.department}</div>
                      </td>
                      <td>
                        <span className={`gpa-badge ${getGpaClass(student.gpa)}`}>
                          {student.gpa.toFixed(2)} - {getGpaLabel(student.gpa)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${student.status.toLowerCase().replace(' ', '-')}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-secondary btn-icon" 
                            style={{ width: '32px', height: '32px' }}
                            title="Xem chi tiết"
                            onClick={() => openDetailModal(student.id)}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-icon" 
                            style={{ width: '32px', height: '32px' }}
                            title="Chỉnh sửa"
                            onClick={() => openEditModal(student)}
                          >
                            <Edit size={14} style={{ color: 'var(--primary)' }} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-icon" 
                            style={{ width: '32px', height: '32px' }}
                            title="Xóa sinh viên"
                            onClick={() => triggerDelete(student)}
                          >
                            <Trash2 size={14} style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Row */}
            <div className="pagination">
              <span className="pagination-info">
                Hiển thị <strong>{Math.min(filteredStudents.length, (currentPage - 1) * itemsPerPage + 1)}</strong> đến{' '}
                <strong>{Math.min(filteredStudents.length, currentPage * itemsPerPage)}</strong> trong tổng số{' '}
                <strong>{filteredStudents.length}</strong> sinh viên
              </span>

              {totalPages > 1 && (
                <div className="pagination-buttons">
                  <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(prev => Math.max(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <GraduationCap size={48} className="empty-state-icon" />
            <h4 className="empty-state-title">Không tìm thấy sinh viên nào</h4>
            <p className="empty-state-desc">Hãy thử thay đổi điều kiện tìm kiếm hoặc thêm sinh viên mới.</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={16} />
              Thêm sinh viên mới
            </button>
          </div>
        )}
      </div>

      {/* CRUD Add/Edit Modal */}
      {isModalOpen && (
        <StudentModal 
          mode={modalMode} 
          student={selectedStudent} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* Profile Detail Modal */}
      {isDetailOpen && detailStudentId && (
        <StudentDetail 
          studentId={detailStudentId} 
          onClose={() => setIsDetailOpen(false)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && studentToDelete && (
        <div className="modal-overlay">
          <div className="modal-window small">
            <div className="modal-header">
              <h3 className="modal-title">Xác nhận xóa</h3>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa sinh viên <strong>{studentToDelete.name}</strong> (MSSV: <strong>{studentToDelete.id}</strong>) ra khỏi hệ thống?</p>
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontWeight: 500 }}>Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Hủy bỏ</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Xóa bỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
