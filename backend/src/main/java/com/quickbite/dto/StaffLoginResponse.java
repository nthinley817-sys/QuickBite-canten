package com.quickbite.dto;

/** Response of POST /api/staff/login */
public record StaffLoginResponse(boolean success, String staffId, String message) {
}
