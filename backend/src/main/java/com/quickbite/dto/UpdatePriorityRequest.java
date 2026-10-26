package com.quickbite.dto;

/** Body of PATCH /api/orders/{id}/priority: "High" or "Normal". */
public record UpdatePriorityRequest(String priority) {
}
