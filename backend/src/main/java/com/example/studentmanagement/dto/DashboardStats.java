package com.example.studentmanagement.dto;

public record DashboardStats(
        int totalStudents,
        int totalClasses,
        double averageGpa,
        int attendanceRate
) {
}
