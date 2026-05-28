package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    java.util.List<Student> findByDepartmentIgnoreCase(String department);
    java.util.List<Student> findByClassNameIgnoreCase(String className);
    boolean existsByDepartmentIgnoreCase(String department);
    boolean existsByClassNameIgnoreCase(String className);
}

