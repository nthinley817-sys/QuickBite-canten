package com.quickbite.dto;

/** Body of POST /api/staff/login */
public record StaffLoginRequest(String staffId, String password) {
}
