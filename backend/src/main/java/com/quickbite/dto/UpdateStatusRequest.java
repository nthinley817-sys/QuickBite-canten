package com.quickbite.dto;

/** Body of PATCH /api/orders/{id}/status */
public record UpdateStatusRequest(String status) {
}
