package com.quickbite.service;

import com.quickbite.dto.OrderDto;
import com.quickbite.dto.OrderItemDto;
import com.quickbite.exception.NotFoundException;
import com.quickbite.model.Order;
import com.quickbite.model.OrderItem;
import com.quickbite.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderService {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public List<OrderDto> getAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList();
    }

    /** Creates a new order. If the caller doesn't supply an id/time (e.g. a
     *  fresh integration that lets the server decide), sensible defaults are
     *  generated — but if it does (as the current frontend's placeOrder()
     *  already does client-side), those values are kept as-is. */
    public OrderDto create(OrderDto dto) {
        Order order = new Order();
        order.setId(dto.id() != null && !dto.id().isBlank() ? dto.id() : generateId());
        order.setCanteen(dto.canteen());
        order.setTotal(dto.total());
        order.setStatus(dto.status() != null && !dto.status().isBlank() ? dto.status() : "Pending");
        order.setPriority(dto.priority() != null && !dto.priority().isBlank() ? dto.priority() : "Normal");
        order.setTime(dto.time() != null && !dto.time().isBlank() ? dto.time() : TIME_FORMAT.format(LocalDateTime.now()));
        order.setCreatedAt(Instant.now());

        List<OrderItem> items = dto.items() == null ? List.of() : dto.items().stream()
                .map(i -> {
                    OrderItem oi = new OrderItem(i.name(), i.qty());
                    oi.setOrder(order);
                    return oi;
                })
                .toList();
        order.setItems(items);

        return toDto(repository.save(order));
    }

    public OrderDto updateStatus(String id, String status) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order " + id + " not found"));
        order.setStatus(status);
        return toDto(repository.save(order));
    }

    private String generateId() {
        long n = repository.count() + 1001;
        return "QB-" + n;
    }

    private OrderDto toDto(Order o) {
        List<OrderItemDto> items = o.getItems().stream()
                .map(i -> new OrderItemDto(i.getName(), i.getQty()))
                .toList();
        return new OrderDto(o.getId(), o.getCanteen(), items, o.getTotal(), o.getStatus(), o.getPriority(), o.getTime());
    }
}
