package com.quickbite.controller;

import com.quickbite.dto.CanteenDto;
import com.quickbite.repository.CanteenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Not yet called by the frontend (CANTEENS is still a static file in
 * data/canteens.js), included so canteens can be moved into MySQL later
 * without any new backend work.
 */
@RestController
@RequestMapping("/api/canteens")
public class CanteenController {

    private final CanteenRepository repository;

    public CanteenController(CanteenRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CanteenDto> getCanteens() {
        return repository.findAll().stream()
                .map(c -> new CanteenDto(c.getId(), c.getName(), c.getLocation(), c.getDesc(), c.getImage()))
                .toList();
    }
}
