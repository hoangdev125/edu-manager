package com.example.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSchoolClassRequest(
        @NotBlank String code,
        @NotBlank String departmentName
) {
}
