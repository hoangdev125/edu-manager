package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.CreateDepartmentRequest;
import com.example.studentmanagement.dto.CreateSchoolClassRequest;
import com.example.studentmanagement.dto.UpdateDepartmentRequest;
import com.example.studentmanagement.dto.UpdateSchoolClassRequest;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.SchoolClass;
import com.example.studentmanagement.service.AcademicCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/academic")
public class AcademicCatalogController {
    private final AcademicCatalogService academicCatalogService;

    public AcademicCatalogController(AcademicCatalogService academicCatalogService) {
        this.academicCatalogService = academicCatalogService;
    }

    @GetMapping("/departments")
    public List<Department> findDepartments() {
        return academicCatalogService.findDepartments();
    }

    @PostMapping("/departments")
    @ResponseStatus(HttpStatus.CREATED)
    public Department createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        return academicCatalogService.createDepartment(request);
    }

    @GetMapping("/classes")
    public List<SchoolClass> findClasses() {
        return academicCatalogService.findClasses();
    }

    @PostMapping("/classes")
    @ResponseStatus(HttpStatus.CREATED)
    public SchoolClass createClass(@Valid @RequestBody CreateSchoolClassRequest request) {
        SchoolClass schoolClass = academicCatalogService.createClass(request);
        return schoolClass;
    }

    @PutMapping("/departments/{id}")
    public Department updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDepartmentRequest request
    ) {
        return academicCatalogService.updateDepartment(id, request);
    }

    @DeleteMapping("/departments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDepartment(@PathVariable Long id) {
        academicCatalogService.deleteDepartment(id);
    }

    @PutMapping("/classes/{id}")
    public SchoolClass updateClass(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSchoolClassRequest request
    ) {
        return academicCatalogService.updateClass(id, request);
    }

    @DeleteMapping("/classes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClass(@PathVariable Long id) {
        academicCatalogService.deleteClass(id);
    }
}
