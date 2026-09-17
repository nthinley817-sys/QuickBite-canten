package com.quickbite.dto;

/** JSON shape matches an order's item entries: {name, qty}. */
public record OrderItemDto(String name, int qty) {
}
