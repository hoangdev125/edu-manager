package com.example.studentmanagement.service;

import com.example.studentmanagement.exception.NotFoundException;
import com.example.studentmanagement.model.Subject;
import com.example.studentmanagement.repository.SubjectRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;

    public SubjectService(SubjectRepository subjectRepository, StudentRepository studentRepository) {
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
    }

    public List<Subject> findSubjects() {
        return subjectRepository.findAll().stream()
                .sorted(Comparator.comparing(Subject::getCode))
                .toList();
    }

    @Transactional
    public Subject createSubject(Subject subject) {
        String code = subject.getCode().trim().toUpperCase();
        if (subjectRepository.existsByCodeIgnoreCase(code)) {
            throw new IllegalArgumentException("Subject already exists with code: " + code);
        }
        subject.setCode(code);
        subject.setName(subject.getName().trim());
        return subjectRepository.save(subject);
    }

    @Transactional
    public Subject updateSubject(Long id, Subject updated) {
        Subject existing = subjectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Subject not found: " + id));

        String newCode = updated.getCode().trim().toUpperCase();
        String newName = updated.getName().trim();

        if (!existing.getCode().equalsIgnoreCase(newCode)) {
            if (subjectRepository.existsByCodeIgnoreCase(newCode)) {
                throw new IllegalArgumentException("Subject already exists with code: " + newCode);
            }
            
            // Sync all students grades that match the old subject code
            String oldCode = existing.getCode();
            studentRepository.findAll().forEach(student -> {
                boolean modified = false;
                for (var grade : student.getGrades()) {
                    if (grade.getSubjectCode().equalsIgnoreCase(oldCode)) {
                        grade.setSubjectCode(newCode);
                        grade.setSubjectName(newName);
                        modified = true;
                    }
                }
                if (modified) {
                    studentRepository.save(student);
                }
            });
        } else {
            // Even if code is same, if name changed, update it in student grades
            String code = existing.getCode();
            studentRepository.findAll().forEach(student -> {
                boolean modified = false;
                for (var grade : student.getGrades()) {
                    if (grade.getSubjectCode().equalsIgnoreCase(code)) {
                        grade.setSubjectName(newName);
                        modified = true;
                    }
                }
                if (modified) {
                    studentRepository.save(student);
                }
            });
        }

        existing.setCode(newCode);
        existing.setName(newName);
        existing.setCredits(updated.getCredits());
        return subjectRepository.save(existing);
    }

    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Subject not found: " + id));

        String code = subject.getCode();
        // Verify if any student has grades for this subject
        boolean inUse = studentRepository.findAll().stream()
                .anyMatch(student -> student.getGrades().stream()
                        .anyMatch(grade -> grade.getSubjectCode().equalsIgnoreCase(code)));

        if (inUse) {
            throw new IllegalArgumentException("Không thể xóa môn học này vì đã được nhập điểm cho sinh viên.");
        }

        subjectRepository.delete(subject);
    }
}
