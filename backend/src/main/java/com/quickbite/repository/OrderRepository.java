package com.quickbite.repository;

import com.quickbite.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCanteenIdOrderByCreatedAtDesc(String canteenId);

    /** Unsorted on purpose: the data-structures demo sorts and queues these in Java. */
    List<Order> findByCanteenId(String canteenId);
}
