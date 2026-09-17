package com.quickbite.service;

import com.quickbite.dto.MenuItemDto;
import com.quickbite.exception.NotFoundException;
import com.quickbite.model.MenuItem;
import com.quickbite.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    private final MenuItemRepository repository;

    public MenuService(MenuItemRepository repository) {
        this.repository = repository;
    }

    public List<MenuItemDto> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public MenuItemDto update(String id, MenuItemDto dto) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Menu item " + id + " not found"));
        item.setName(dto.name());
        item.setCategory(dto.category());
        item.setPrice(dto.price());
        item.setDesc(dto.desc());
        item.setImage(dto.image());
        item.setAvailable(dto.available());
        return toDto(repository.save(item));
    }

    private MenuItemDto toDto(MenuItem m) {
        return new MenuItemDto(m.getId(), m.getName(), m.getCategory(), m.getPrice(), m.getDesc(), m.getImage(), m.isAvailable());
    }
}
