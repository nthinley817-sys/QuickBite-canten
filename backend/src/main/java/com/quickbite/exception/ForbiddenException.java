package com.quickbite.exception;

/** Logged in, but not allowed to touch this record, e.g. another canteen's order (HTTP 403). */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
