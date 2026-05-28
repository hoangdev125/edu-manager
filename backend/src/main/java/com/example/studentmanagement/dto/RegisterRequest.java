package com.example.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String fullName,
        @NotBlank String role,
        String studentId
) {
}
