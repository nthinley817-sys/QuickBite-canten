package com.quickbite.service;

import com.quickbite.repository.StaffRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class StaffService {

    private final StaffRepository repository;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public StaffService(StaffRepository repository) {
        this.repository = repository;
    }

    public boolean login(String staffId, String password) {
        if (staffId == null || password == null) return false;
        return repository.findByStaffId(staffId.trim())
                .map(s -> encoder.matches(password, s.getPasswordHash()))
                .orElse(false);
    }
}
