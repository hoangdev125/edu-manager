package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.LoginRequest;
import com.example.studentmanagement.dto.RegisterRequest;
import com.example.studentmanagement.model.UserAccount;
import com.example.studentmanagement.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    private final UserAccountRepository userAccountRepository;

    public AuthService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public List<UserAccount> findAll() {
        return userAccountRepository.findAll().stream()
                .sorted(Comparator.comparing(UserAccount::getUsername))
                .toList();
    }

    public Optional<UserAccount> login(LoginRequest request) {
        return userAccountRepository.findByUsernameIgnoreCase(request.username().trim())
                .filter(user -> user.getPassword().equals(request.password()));
    }

    public UserAccount register(RegisterRequest request) {
        String username = request.username().trim().toLowerCase();
        if (userAccountRepository.findByUsernameIgnoreCase(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setUsername(username);
        userAccount.setPassword(request.password());
        userAccount.setFullName(request.fullName().trim());
        userAccount.setRole(request.role());
        userAccount.setStudentId(request.studentId());
        return userAccountRepository.save(userAccount);
    }
}
