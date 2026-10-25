package com.quickbite.controller;

import com.quickbite.auth.StaffPrincipal;
import com.quickbite.auth.StaffTokenService;
import com.quickbite.dto.MenuItemDto;
import com.quickbite.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Anyone can read the menu. Adding, editing and deleting items is
 * staff-only and limited to the staff member's own canteen.
 */
@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private static final String AUTH = "Authorization";

    private final MenuService service;
    private final StaffTokenService tokens;

    public MenuController(MenuService service, StaffTokenService tokens) {
        this.service = service;
        this.tokens = tokens;
    }

    @GetMapping
    public List<MenuItemDto> getMenu(@RequestParam(required = false) String canteen) {
        return service.getAll(canteen);
    }

    @PostMapping
    public MenuItemDto createMenuItem(@RequestBody MenuItemDto dto,
                                      @RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        return service.create(dto, staff.canteenId());
    }

    @PutMapping("/{id}")
    public MenuItemDto updateMenuItem(@PathVariable String id, @RequestBody MenuItemDto dto,
                                      @RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        return service.update(id, dto, staff.canteenId());
    }

    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable String id, @RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        service.delete(id, staff.canteenId());
    }
}
