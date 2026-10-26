package com.quickbite.controller;

import com.quickbite.auth.StaffPrincipal;
import com.quickbite.auth.StaffTokenService;
import com.quickbite.dto.OrderDto;
import com.quickbite.dto.UpdatePriorityRequest;
import com.quickbite.dto.UpdateStatusRequest;
import com.quickbite.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Customers (no login) can place an order and look up a single order by id
 * to track it. The order list, status changes and deletes are staff-only
 * and limited to the staff member's own canteen.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final String AUTH = "Authorization";

    private final OrderService service;
    private final StaffTokenService tokens;

    public OrderController(OrderService service, StaffTokenService tokens) {
        this.service = service;
        this.tokens = tokens;
    }

    @GetMapping
    public List<OrderDto> getOrders(@RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        return service.getForCanteen(staff.canteenId());
    }

    @GetMapping("/{id}")
    public OrderDto getOrder(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public OrderDto createOrder(@RequestBody OrderDto dto) {
        return service.create(dto);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable String id, @RequestBody UpdateStatusRequest req,
                                 @RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        return service.updateStatus(id, req.status(), staff.canteenId());
    }

    @PatchMapping("/{id}/priority")
    public OrderDto updatePriority(@PathVariable String id, @RequestBody UpdatePriorityRequest req,
                                   @RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        return service.updatePriority(id, req.priority(), staff.canteenId());
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable String id, @RequestHeader(value = AUTH, required = false) String auth) {
        StaffPrincipal staff = tokens.requireStaff(auth);
        service.delete(id, staff.canteenId());
    }
}
