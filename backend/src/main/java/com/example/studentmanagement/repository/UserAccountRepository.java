package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
    Optional<UserAccount> findByUsernameIgnoreCase(String username);
}
