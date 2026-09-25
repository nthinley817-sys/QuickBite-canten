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

    public List<MenuItemDto> getAll(String canteenId) {
        List<MenuItem> items = (canteenId == null || canteenId.isBlank())
                ? repository.findAll()
                : repository.findByCanteenId(canteenId);
        return items.stream().map(this::toDto).toList();
    }

    public MenuItemDto create(MenuItemDto dto) {
        MenuItem item = new MenuItem(dto.id(), dto.name(), dto.category(), dto.price(), dto.desc(), dto.image(), dto.available(), dto.canteenId());
        return toDto(repository.save(item));
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

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Menu item " + id + " not found");
        }
        repository.deleteById(id);
    }

    private MenuItemDto toDto(MenuItem m) {
        return new MenuItemDto(m.getId(), m.getName(), m.getCategory(), m.getPrice(), m.getDesc(), m.getImage(), m.isAvailable(), m.getCanteenId());
    }
}
