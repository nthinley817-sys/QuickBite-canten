package com.quickbite.controller;

import com.quickbite.dto.MenuItemDto;
import com.quickbite.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Matches src/services/api.js: Api.getMenu() -> GET /api/menu,
 * Api.updateMenuItem(item) -> PUT /api/menu/{id}.
 */
@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService service;

    public MenuController(MenuService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuItemDto> getMenu(@RequestParam(required = false) String canteen) {
        return service.getAll(canteen);
    }

    @PostMapping
    public MenuItemDto createMenuItem(@RequestBody MenuItemDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public MenuItemDto updateMenuItem(@PathVariable String id, @RequestBody MenuItemDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable String id) {
        service.delete(id);
    }
}
