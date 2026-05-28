package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByCodeIgnoreCase(String code);

    Optional<Subject> findByCodeIgnoreCase(String code);
}
