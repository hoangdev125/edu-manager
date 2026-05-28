package com.example.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateDepartmentRequest(
        @NotBlank String admissionCode,
        @NotBlank String name
) {
}
