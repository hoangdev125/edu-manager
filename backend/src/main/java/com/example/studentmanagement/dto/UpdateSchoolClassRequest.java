package com.example.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateSchoolClassRequest(
        @NotBlank String code,
        @NotBlank String departmentName
) {
}
