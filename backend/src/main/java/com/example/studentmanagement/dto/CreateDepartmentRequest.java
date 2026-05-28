package com.example.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateDepartmentRequest(
        @NotBlank String admissionCode,
        @NotBlank String name
) {
}
