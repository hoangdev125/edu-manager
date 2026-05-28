package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.CreateDepartmentRequest;
import com.example.studentmanagement.dto.CreateSchoolClassRequest;
import com.example.studentmanagement.dto.UpdateDepartmentRequest;
import com.example.studentmanagement.dto.UpdateSchoolClassRequest;
import com.example.studentmanagement.exception.NotFoundException;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.SchoolClass;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.SchoolClassRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class AcademicCatalogService {
    private final DepartmentRepository departmentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;

    public AcademicCatalogService(
            DepartmentRepository departmentRepository,
            SchoolClassRepository schoolClassRepository,
            StudentRepository studentRepository
    ) {
        this.departmentRepository = departmentRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.studentRepository = studentRepository;
    }

    public List<Department> findDepartments() {
        return departmentRepository.findAll().stream()
                .sorted(Comparator.comparing(Department::getName))
                .toList();
    }

    public Department createDepartment(CreateDepartmentRequest request) {
        String admissionCode = request.admissionCode().trim().toUpperCase();
        String name = request.name().trim();
        if (departmentRepository.existsByAdmissionCodeIgnoreCase(admissionCode)) {
            throw new IllegalArgumentException("Department code already exists");
        }
        if (departmentRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Department already exists");
        }

        Department department = new Department();
        department.setAdmissionCode(admissionCode);
        department.setName(name);
        return departmentRepository.save(department);
    }

    public List<SchoolClass> findClasses() {
        return schoolClassRepository.findAll().stream()
                .sorted(Comparator.comparing(SchoolClass::getCode))
                .toList();
    }

    public SchoolClass createClass(CreateSchoolClassRequest request) {
        String code = request.code().trim().toUpperCase();
        String departmentName = request.departmentName().trim();

        if (schoolClassRepository.existsByCodeIgnoreCase(code)) {
            throw new IllegalArgumentException("Class already exists");
        }
        if (departmentRepository.findByNameIgnoreCase(departmentName).isEmpty()) {
            throw new NotFoundException("Department not found: " + departmentName);
        }

        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setCode(code);
        schoolClass.setDepartmentName(departmentName);
        return schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public Department updateDepartment(Long id, UpdateDepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Department not found: " + id));

        String oldName = department.getName();
        String oldCode = department.getAdmissionCode();
        String newCode = request.admissionCode().trim().toUpperCase();
        String newName = request.name().trim();

        if (oldName.equalsIgnoreCase(newName) && oldCode.equalsIgnoreCase(newCode)) {
            department.setAdmissionCode(newCode);
            department.setName(newName);
            return departmentRepository.save(department);
        }

        if (!oldCode.equalsIgnoreCase(newCode) && departmentRepository.existsByAdmissionCodeIgnoreCase(newCode)) {
            throw new IllegalArgumentException("Department code already exists");
        }
        if (departmentRepository.existsByNameIgnoreCase(newName)) {
            throw new IllegalArgumentException("Department already exists");
        }

        // Update all related classes
        List<SchoolClass> classes = schoolClassRepository.findByDepartmentNameIgnoreCase(oldName);
        for (SchoolClass sc : classes) {
            sc.setDepartmentName(newName);
            schoolClassRepository.save(sc);
        }

        // Update all related students
        List<Student> students = studentRepository.findByDepartmentIgnoreCase(oldName);
        for (Student student : students) {
            student.setDepartment(newName);
            studentRepository.save(student);
        }

        department.setAdmissionCode(newCode);
        department.setName(newName);
        return departmentRepository.save(department);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Department not found: " + id));

        String name = department.getName();

        if (schoolClassRepository.existsByDepartmentNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Không thể xóa khoa vì đang có lớp học thuộc khoa này.");
        }

        if (studentRepository.existsByDepartmentIgnoreCase(name)) {
            throw new IllegalArgumentException("Không thể xóa khoa vì đang có sinh viên thuộc khoa này.");
        }

        departmentRepository.delete(department);
    }

    @Transactional
    public SchoolClass updateClass(Long id, UpdateSchoolClassRequest request) {
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Class not found: " + id));

        String oldCode = schoolClass.getCode();
        String newCode = request.code().trim().toUpperCase();
        String departmentName = request.departmentName().trim();

        if (departmentRepository.findByNameIgnoreCase(departmentName).isEmpty()) {
            throw new NotFoundException("Department not found: " + departmentName);
        }

        if (!oldCode.equalsIgnoreCase(newCode)) {
            if (schoolClassRepository.existsByCodeIgnoreCase(newCode)) {
                throw new IllegalArgumentException("Class already exists");
            }

            // Update all related students
            List<Student> students = studentRepository.findByClassNameIgnoreCase(oldCode);
            for (Student student : students) {
                student.setClassName(newCode);
                studentRepository.save(student);
            }
        }

        schoolClass.setCode(newCode);
        schoolClass.setDepartmentName(departmentName);
        return schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public void deleteClass(Long id) {
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Class not found: " + id));

        String code = schoolClass.getCode();

        if (studentRepository.existsByClassNameIgnoreCase(code)) {
            throw new IllegalArgumentException("Không thể xóa lớp học vì đang có sinh viên học lớp này.");
        }

        schoolClassRepository.delete(schoolClass);
    }
}
