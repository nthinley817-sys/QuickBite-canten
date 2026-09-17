package com.quickbite.dto;

import java.util.List;

/** JSON shape matches ORDERS_SEED entries in the frontend's data/orders.js exactly. */
public record OrderDto(
        String id,
        String canteen,
        List<OrderItemDto> items,
        int total,
        String status,
        String priority,
        String time
) {
}
