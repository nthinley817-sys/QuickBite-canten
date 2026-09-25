package com.quickbite.controller;

import com.quickbite.dto.StaffLoginRequest;
import com.quickbite.dto.StaffLoginResponse;
import com.quickbite.service.StaffService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService service;

    public StaffController(StaffService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public StaffLoginResponse login(@RequestBody StaffLoginRequest req) {
        return service.authenticate(req.staffId(), req.password())
                .map(s -> new StaffLoginResponse(true, s.getStaffId(), s.getCanteenId(), "Welcome back!"))
                .orElseGet(() -> new StaffLoginResponse(false, req.staffId(), null, "Invalid staff ID or password."));
    }
}
