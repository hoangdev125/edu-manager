package com.example.studentmanagement.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OrderColumn;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Student {
    @Id
    @NotBlank
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String gender;

    @NotBlank
    private String dob;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    private String className;

    @NotBlank
    private String department;

    private double gpa;

    @NotBlank
    private String status;

    @Valid
    @NotNull
    @ElementCollection(fetch = FetchType.EAGER)
    @OrderColumn(name = "grade_order")
    private List<Grade> grades = new ArrayList<>();

    @Valid
    @NotNull
    @ElementCollection(fetch = FetchType.EAGER)
    @OrderColumn(name = "activity_order")
    private List<ActivityLog> activities = new ArrayList<>();

    private String notes;
    private String avatar;
    private int conductScore = 80;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }

    public List<ActivityLog> getActivities() {
        return activities;
    }

    public void setActivities(List<ActivityLog> activities) {
        this.activities = activities;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public int getConductScore() {
        return conductScore;
    }

    public void setConductScore(int conductScore) {
        this.conductScore = conductScore;
    }
}
