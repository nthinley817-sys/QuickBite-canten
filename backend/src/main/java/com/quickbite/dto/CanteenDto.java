package com.quickbite.dto;

/** JSON shape matches CANTEENS in the frontend's data/canteens.js exactly. */
public record CanteenDto(String id, String name, String location, String desc, String image) {
}
