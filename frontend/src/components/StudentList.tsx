import React, { useState, useMemo, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import type { Student } from '../types/student';
import { StudentFilters } from './subcomponents/StudentFilters';
import { StudentTable } from './subcomponents/StudentTable';
import { Pagination } from './subcomponents/Pagination';
import { DeleteConfirmModal } from './subcomponents/DeleteConfirmModal';
import { StudentModal } from './StudentModal';
import { StudentDetail } from './StudentDetail';
import { GraduationCap, Plus } from 'lucide-react';

export const StudentList: React.FC = () => {
  const { students, deleteStudent } = useStudents();
  
  // Search & Filter state (parent state is updated after debounce from subcomponent)
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

  // Sort Handler
  const handleSort = (field: 'name' | 'id' | 'gpa') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedClass, selectedStatus, selectedGpaRange]);

  // Filter & Search Logic
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

  // Pagination Logic
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Modal Triggers
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

  const confirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete.id);
      setIsDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleExportCSV = () => {
    // Generate CSV headers
    const headers = [
      'MSSV',
      'Họ và Tên',
      'Giới tính',
      'Ngày sinh',
      'Email',
      'Số điện thoại',
      'Địa chỉ',
      'Lớp',
      'Khoa',
      'GPA',
      'Điểm rèn luyện',
      'Trạng thái'
    ];

    // Generate CSV rows
    const rows = filteredStudents.map(student => [
      student.id,
      student.name,
      student.gender,
      student.dob,
      student.email,
      student.phone,
      `"${(student.address || '').replace(/"/g, '""')}"`, // escape quotes
      student.className,
      student.department,
      student.gpa.toString(),
      (student.conductScore || 85).toString(),
      student.status
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_sinh_vien_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Student Filters */}
      <StudentFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedGpaRange={selectedGpaRange}
        setSelectedGpaRange={setSelectedGpaRange}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onAddClick={openAddModal}
        onExportClick={handleExportCSV}
      />

      {/* Main Content Area */}
      {filteredStudents.length > 0 ? (
        <div className="flex flex-col gap-4">
          <StudentTable 
            students={paginatedStudents}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={openDetailModal}
            onEdit={openEditModal}
            onDelete={triggerDelete}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg transition-all duration-300 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center gap-3 max-w-sm">
            <GraduationCap size={48} className="text-text-muted opacity-40 animate-pulse" />
            <h4 className="font-title font-bold text-base text-text-primary">Không tìm thấy sinh viên nào</h4>
            <p className="text-xs text-text-secondary">Hãy thử thay đổi điều kiện tìm kiếm hoặc thêm sinh viên mới.</p>
            <button className="h-10 px-5 rounded-xl font-semibold bg-accent-gradient text-white hover:brightness-110 active:translate-y-0 transition-all duration-200 cursor-pointer text-xs mt-2 inline-flex items-center gap-2" onClick={openAddModal}>
              <Plus size={16} />
              Thêm sinh viên mới
            </button>
          </div>
        </div>
      )}

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
        <DeleteConfirmModal 
          isOpen={isDeleteConfirmOpen}
          studentName={studentToDelete.name}
          studentId={studentToDelete.id}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};
