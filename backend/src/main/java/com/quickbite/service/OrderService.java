package com.quickbite.service;

import com.quickbite.dto.OrderDto;
import com.quickbite.dto.OrderItemDto;
import com.quickbite.exception.ForbiddenException;
import com.quickbite.exception.NotFoundException;
import com.quickbite.model.Canteen;
import com.quickbite.model.MenuItem;
import com.quickbite.model.Order;
import com.quickbite.model.OrderItem;
import com.quickbite.repository.CanteenRepository;
import com.quickbite.repository.MenuItemRepository;
import com.quickbite.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");
    /** Order times are shown to people in the canteen, not in the server's (UTC) zone. */
    private static final ZoneId CANTEEN_ZONE = ZoneId.of("Asia/Thimphu");
    private static final Set<String> STATUSES = Set.of("Pending", "Processing", "Completed");
    private static final Set<String> PRIORITIES = Set.of("Normal", "High");
    private static final int MAX_TABLE_NUMBER = 100;
    private static final int MAX_ITEM_QTY = 50;

    private final OrderRepository repository;
    private final MenuItemRepository menuRepository;
    private final CanteenRepository canteenRepository;
    private final JdbcTemplate jdbc;

    public OrderService(OrderRepository repository, MenuItemRepository menuRepository,
                        CanteenRepository canteenRepository, JdbcTemplate jdbc) {
        this.repository = repository;
        this.menuRepository = menuRepository;
        this.canteenRepository = canteenRepository;
        this.jdbc = jdbc;
    }

    /** A database sequence hands out order numbers, so two customers ordering
     *  at the same moment can never be given the same id. */
    @PostConstruct
    void initOrderNumberSequence() {
        jdbc.execute("CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001");
    }

    public List<OrderDto> getForCanteen(String canteenId) {
        return repository.findByCanteenIdOrderByCreatedAtDesc(canteenId).stream().map(this::toDto).toList();
    }

    public OrderDto getById(String id) {
        return toDto(find(id));
    }

    /** Creates a new order. The server decides everything the customer
     *  shouldn't control: the id, the item names and prices (looked up from
     *  the menu), the total, the starting status and the time. */
    @Transactional
    public OrderDto create(OrderDto dto) {
        if (dto.canteenId() == null || dto.canteenId().isBlank()) {
            throw new IllegalArgumentException("canteenId is required");
        }
        Canteen canteen = canteenRepository.findById(dto.canteenId())
                .orElseThrow(() -> new IllegalArgumentException("Unknown canteen: " + dto.canteenId()));
        if (dto.tableNumber() < 1 || dto.tableNumber() > MAX_TABLE_NUMBER) {
            throw new IllegalArgumentException("Please select a valid table number.");
        }
        if (dto.items() == null || dto.items().isEmpty()) {
            throw new IllegalArgumentException("An order must contain at least one item.");
        }

        Order order = new Order();
        List<OrderItem> items = new ArrayList<>();
        int total = 0;
        for (OrderItemDto i : dto.items()) {
            if (i.qty() < 1 || i.qty() > MAX_ITEM_QTY) {
                throw new IllegalArgumentException("Item quantity must be between 1 and " + MAX_ITEM_QTY + ".");
            }
            MenuItem menuItem = (i.menuItemId() == null ? null : menuRepository.findById(i.menuItemId()).orElse(null));
            if (menuItem == null || !menuItem.getCanteenId().equals(canteen.getId())) {
                throw new IllegalArgumentException("An item in your cart is no longer on the " + canteen.getName() + " menu.");
            }
            if (!menuItem.isAvailable()) {
                throw new IllegalArgumentException(menuItem.getName() + " is currently unavailable.");
            }
            total += menuItem.getPrice() * i.qty();
            OrderItem oi = new OrderItem(menuItem.getName(), i.qty());
            oi.setMenuItemId(menuItem.getId());
            oi.setOrder(order);
            items.add(oi);
        }

        order.setId(nextOrderId());
        order.setCanteen(canteen.getName());
        order.setCanteenId(canteen.getId());
        order.setTotal(total);
        order.setStatus("Pending");
        order.setPriority("Normal");
        order.setTime(TIME_FORMAT.format(ZonedDateTime.now(CANTEEN_ZONE)));
        order.setTableNumber(dto.tableNumber());
        order.setCreatedAt(Instant.now());
        order.setItems(items);

        return toDto(repository.save(order));
    }

    public OrderDto updateStatus(String id, String status, String staffCanteenId) {
        if (status == null || !STATUSES.contains(status)) {
            throw new IllegalArgumentException("Status must be one of " + STATUSES);
        }
        Order order = findForCanteen(id, staffCanteenId);
        order.setStatus(status);
        return toDto(repository.save(order));
    }

    /** Staff can mark an order High priority so the priority queue serves it first. */
    public OrderDto updatePriority(String id, String priority, String staffCanteenId) {
        if (priority == null || !PRIORITIES.contains(priority)) {
            throw new IllegalArgumentException("Priority must be one of " + PRIORITIES);
        }
        Order order = findForCanteen(id, staffCanteenId);
        order.setPriority(priority);
        return toDto(repository.save(order));
    }

    public void delete(String id, String staffCanteenId) {
        repository.delete(findForCanteen(id, staffCanteenId));
    }

    private Order find(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order " + id + " not found"));
    }

    /** Staff may only act on orders placed at their own canteen. */
    private Order findForCanteen(String id, String staffCanteenId) {
        Order order = find(id);
        if (!staffCanteenId.equals(order.getCanteenId())) {
            throw new ForbiddenException("Order " + id + " belongs to another canteen.");
        }
        return order;
    }

    /** Skips numbers already taken by seeded orders or by ids the old
     *  frontend generated client-side, so nothing existing is overwritten. */
    private String nextOrderId() {
        String id;
        do {
            id = "QB-" + jdbc.queryForObject("SELECT nextval('order_number_seq')", Long.class);
        } while (repository.existsById(id));
        return id;
    }

    public OrderDto toDto(Order o) {
        List<OrderItemDto> items = o.getItems().stream()
                .map(i -> new OrderItemDto(i.getMenuItemId(), i.getName(), i.getQty()))
                .toList();
        return new OrderDto(o.getId(), o.getCanteen(), o.getCanteenId(), items, o.getTotal(), o.getStatus(), o.getPriority(), o.getTime(), o.getTableNumber(),
                o.getCreatedAt() == null ? null : o.getCreatedAt().toString());
    }
}
