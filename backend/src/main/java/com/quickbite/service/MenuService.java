package com.quickbite.service;

import com.quickbite.dto.MenuItemDto;
import com.quickbite.exception.NotFoundException;
import com.quickbite.model.MenuItem;
import com.quickbite.repository.CanteenRepository;
import com.quickbite.repository.MenuItemRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    private static final int MAX_PRICE = 100_000;

    private final MenuItemRepository repository;
    private final CanteenRepository canteenRepository;
    private final JdbcTemplate jdbc;

    public MenuService(MenuItemRepository repository, CanteenRepository canteenRepository, JdbcTemplate jdbc) {
        this.repository = repository;
        this.canteenRepository = canteenRepository;
        this.jdbc = jdbc;
    }

    /** Same idea as order numbers: the server hands out menu item ids so a
     *  new item can never replace an existing one. */
    @PostConstruct
    void initMenuItemSequence() {
        jdbc.execute("CREATE SEQUENCE IF NOT EXISTS menu_item_seq START WITH 100");
    }

    public List<MenuItemDto> getAll(String canteenId) {
        List<MenuItem> items = (canteenId == null || canteenId.isBlank())
                ? repository.findAll()
                : repository.findByCanteenId(canteenId);
        return items.stream().map(this::toDto).toList();
    }

    public MenuItemDto create(MenuItemDto dto) {
        if (dto.canteenId() == null || !canteenRepository.existsById(dto.canteenId())) {
            throw new IllegalArgumentException("Unknown canteen: " + dto.canteenId());
        }
        validate(dto);
        MenuItem item = new MenuItem(nextMenuItemId(dto.canteenId()), dto.name().trim(), dto.category(), dto.price(),
                dto.desc(), dto.image(), dto.available(), dto.canteenId());
        return toDto(repository.save(item));
    }

    public MenuItemDto update(String id, MenuItemDto dto) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Menu item " + id + " not found"));
        validate(dto);
        item.setName(dto.name().trim());
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

    private void validate(MenuItemDto dto) {
        if (dto.name() == null || dto.name().isBlank()) {
            throw new IllegalArgumentException("Item name is required.");
        }
        if (dto.category() == null || dto.category().isBlank()) {
            throw new IllegalArgumentException("Item category is required.");
        }
        if (dto.price() < 1 || dto.price() > MAX_PRICE) {
            throw new IllegalArgumentException("Price must be between 1 and " + MAX_PRICE + ".");
        }
    }

    private String nextMenuItemId(String canteenId) {
        String id;
        do {
            id = canteenId + "-M" + jdbc.queryForObject("SELECT nextval('menu_item_seq')", Long.class);
        } while (repository.existsById(id));
        return id;
    }

    private MenuItemDto toDto(MenuItem m) {
        return new MenuItemDto(m.getId(), m.getName(), m.getCategory(), m.getPrice(), m.getDesc(), m.getImage(), m.isAvailable(), m.getCanteenId());
    }
}
