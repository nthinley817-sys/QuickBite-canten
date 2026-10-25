package com.quickbite.dto;

/**
 * JSON shape of an order's item entries: {menuItemId, name, qty}. On create
 * the client only needs menuItemId + qty; name (and the price used for the
 * total) are looked up server-side so a client can't change what it pays.
 */
public record OrderItemDto(String menuItemId, String name, int qty) {
}
