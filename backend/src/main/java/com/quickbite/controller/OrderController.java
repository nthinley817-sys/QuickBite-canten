package com.quickbite.controller;

import com.quickbite.dto.OrderDto;
import com.quickbite.dto.UpdateStatusRequest;
import com.quickbite.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Matches src/services/api.js: Api.getOrders() -> GET /api/orders,
 * Api.createOrder(order) -> POST /api/orders,
 * Api.updateOrderStatus(id, status) -> PATCH /api/orders/{id}/status.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<OrderDto> getOrders() {
        return service.getAll();
    }

    @PostMapping
    public OrderDto createOrder(@RequestBody OrderDto dto) {
        return service.create(dto);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable String id, @RequestBody UpdateStatusRequest req) {
        return service.updateStatus(id, req.status());
    }
}
