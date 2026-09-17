package com.quickbite.dto;

/** JSON shape matches MENU_SEED items in the frontend's data/menu.js exactly. */
public record MenuItemDto(
        String id,
        String name,
        String category,
        int price,
        String desc,
        String image,
        boolean available
) {
}
