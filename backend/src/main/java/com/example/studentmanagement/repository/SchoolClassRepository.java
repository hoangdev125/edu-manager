package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    boolean existsByCodeIgnoreCase(String code);

    Optional<SchoolClass> findByCodeIgnoreCase(String code);

    java.util.List<SchoolClass> findByDepartmentNameIgnoreCase(String departmentName);

    boolean existsByDepartmentNameIgnoreCase(String departmentName);
}
