package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsByAdmissionCodeIgnoreCase(String admissionCode);

    Optional<Department> findByNameIgnoreCase(String name);
}
