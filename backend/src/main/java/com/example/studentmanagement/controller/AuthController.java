package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.LoginRequest;
import com.example.studentmanagement.dto.RegisterRequest;
import com.example.studentmanagement.model.UserAccount;
import com.example.studentmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public List<UserAccount> findAll() {
        return authService.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid username or password")));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserAccount register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
