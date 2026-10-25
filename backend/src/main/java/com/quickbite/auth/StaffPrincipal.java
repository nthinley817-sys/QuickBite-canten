package com.quickbite.auth;

/** The signed-in staff member a request was made by. */
public record StaffPrincipal(String staffId, String canteenId) {
}
