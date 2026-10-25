package com.quickbite.dto;

/** Response of POST /api/staff/login. token is null when login fails. */
public record StaffLoginResponse(boolean success, String staffId, String canteenId, String token, String message) {
}
