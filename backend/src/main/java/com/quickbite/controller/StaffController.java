package com.quickbite.controller;

import com.quickbite.dto.StaffLoginRequest;
import com.quickbite.dto.StaffLoginResponse;
import com.quickbite.service.StaffService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Not yet called by the frontend (StaffLogin.jsx still checks the
 * "staff"/"staff123" pair client-side), included so that check can move
 * server-side later by pointing App.jsx's staffLogin() at this endpoint —
 * seeded with the same credentials so nothing breaks meanwhile.
 */
@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService service;

    public StaffController(StaffService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public StaffLoginResponse login(@RequestBody StaffLoginRequest req) {
        boolean ok = service.login(req.staffId(), req.password());
        return ok
                ? new StaffLoginResponse(true, req.staffId(), "Welcome back!")
                : new StaffLoginResponse(false, req.staffId(), "Invalid staff ID or password.");
    }
}
