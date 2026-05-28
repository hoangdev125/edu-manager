package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.DashboardStats;
import com.example.studentmanagement.exception.NotFoundException;
import com.example.studentmanagement.model.ActivityLog;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.Subject;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public StudentService(StudentRepository studentRepository, SubjectRepository subjectRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    public List<Student> findAll() {
        return studentRepository.findAll().stream()
                .sorted(Comparator.comparing(Student::getId))
                .toList();
    }

    public Student findById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Student not found: " + id));
    }

    @Transactional
    public Student create(Student student) {
        String normalizedId = normalizeId(student.getId());
        if (studentRepository.existsById(normalizedId)) {
            throw new IllegalArgumentException("Student already exists: " + normalizedId);
        }

        student.setId(normalizedId);
        if (student.getActivities().isEmpty()) {
            student.getActivities().add(new ActivityLog(
                    "act-" + System.currentTimeMillis(),
                    "Them moi sinh vien vao he thong",
                    Instant.now().toString()
            ));
        }
        calculateGpa(student);
        return studentRepository.save(student);
    }

    @Transactional
    public Student update(String id, Student updatedStudent) {
        Student existing = findById(normalizeId(id));
        updatedStudent.setId(existing.getId());

        String action = buildUpdateAction(existing, updatedStudent);
        updatedStudent.getActivities().add(0, new ActivityLog(
                "act-" + System.currentTimeMillis(),
                action,
                Instant.now().toString()
        ));

        calculateGpa(updatedStudent);
        return studentRepository.save(updatedStudent);
    }

    public void delete(String id) {
        String normalizedId = normalizeId(id);
        if (!studentRepository.existsById(normalizedId)) {
            throw new NotFoundException("Student not found: " + normalizedId);
        }
        studentRepository.deleteById(normalizedId);
    }

    public DashboardStats getStats() {
        List<Student> students = studentRepository.findAll();
        int totalStudents = students.size();
        Set<String> classes = students.stream().map(Student::getClassName).collect(Collectors.toSet());
        double averageGpa = totalStudents == 0
                ? 0
                : Math.round((students.stream().mapToDouble(Student::getGpa).average().orElse(0)) * 100.0) / 100.0;
        int attendanceRate = totalStudents == 0
                ? 0
                : (int) Math.round(students.stream()
                        .mapToDouble(student -> Math.min(100, Math.max(70, 85 + (student.getGpa() / 4.0) * 12)))
                        .average()
                        .orElse(0));

        return new DashboardStats(totalStudents, classes.size(), averageGpa, attendanceRate);
    }

    private String buildUpdateAction(Student existing, Student updatedStudent) {
        List<String> changes = new java.util.ArrayList<>();
        if (!Objects.equals(existing.getName(), updatedStudent.getName())) changes.add("Ho ten");
        if (existing.getGpa() != updatedStudent.getGpa()) changes.add("Diem GPA");
        if (!Objects.equals(existing.getStatus(), updatedStudent.getStatus())) changes.add("Trang thai");
        if (!Objects.equals(existing.getClassName(), updatedStudent.getClassName())) changes.add("Lop");
        if (!Objects.equals(existing.getDepartment(), updatedStudent.getDepartment())) changes.add("Khoa");

        return changes.isEmpty()
                ? "Cap nhat thong tin sinh vien"
                : "Cap nhat thong tin (" + String.join(", ", changes) + ")";
    }

    private String normalizeId(String id) {
        return id.trim().toUpperCase();
    }

    private void calculateGpa(Student student) {
        if (student.getGrades() == null || student.getGrades().isEmpty()) {
            student.setGpa(0.0);
            return;
        }

        double weightedGpaSum = 0.0;
        int totalCredits = 0;

        for (var grade : student.getGrades()) {
            grade.calculateScore(); // Re-calculate dynamic score
            
            // Tra cứu số tín chỉ môn học trong bảng Subject
            int credits = 3; // Mặc định là 3 nếu không tìm thấy
            var subjectOpt = subjectRepository.findByCodeIgnoreCase(grade.getSubjectCode());
            if (subjectOpt.isPresent()) {
                credits = subjectOpt.get().getCredits();
            }

            double score4 = convertTo4Scale(grade.getScore());
            weightedGpaSum += score4 * credits;
            totalCredits += credits;
        }

        double calculated = totalCredits > 0 ? (weightedGpaSum / totalCredits) : 0.0;
        student.setGpa(Math.round(calculated * 100.0) / 100.0);
    }

    private double convertTo4Scale(double score10) {
        if (score10 >= 9.0) return 4.0;
        if (score10 >= 8.0) return 3.5;
        if (score10 >= 7.0) return 3.0;
        if (score10 >= 6.5) return 2.5;
        if (score10 >= 5.5) return 2.0;
        if (score10 >= 5.0) return 1.5;
        if (score10 >= 4.0) return 1.0;
        return 0.0;
    }
}
