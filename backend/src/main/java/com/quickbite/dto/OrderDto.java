package com.quickbite.dto;

import java.util.List;

/** JSON shape matches ORDERS_SEED entries in the frontend's data/orders.js exactly. */
public record OrderDto(
        String id,
        String canteen,
        String canteenId,
        List<OrderItemDto> items,
        int total,
        String status,
        String priority,
        String time,
        int tableNumber,
        /** When the order was placed, as an ISO-8601 instant (e.g. 2026-10-25T19:03:07Z), so clients can show the date too. */
        String placedAt
) {
}
