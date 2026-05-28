package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.Subject;
import com.example.studentmanagement.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public List<Subject> findSubjects() {
        return subjectService.findSubjects();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Subject createSubject(@Valid @RequestBody Subject subject) {
        return subjectService.createSubject(subject);
    }

    @PutMapping("/{id}")
    public Subject updateSubject(@PathVariable Long id, @Valid @RequestBody Subject subject) {
        return subjectService.updateSubject(id, subject);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}
