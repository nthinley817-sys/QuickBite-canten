package com.quickbite.service;

import com.quickbite.model.Staff;
import com.quickbite.repository.StaffRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository repository;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public StaffService(StaffRepository repository) {
        this.repository = repository;
    }

    public Optional<Staff> authenticate(String staffId, String password) {
        if (staffId == null || password == null) return Optional.empty();
        return repository.findByStaffId(staffId.trim())
                .filter(s -> encoder.matches(password, s.getPasswordHash()));
    }
}
