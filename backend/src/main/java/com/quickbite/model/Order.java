package com.quickbite.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Mirrors ORDERS_SEED in data/orders.js: id ("QB-1042"), canteen (display
 * name), items, total, status, priority, time (a preformatted display
 * string, same as the frontend already produces). createdAt is
 * backend-only, used to keep newest-first ordering reliable.
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id;

    private String canteen;

    private int total;

    private String status;

    private String priority;

    private String time;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = jakarta.persistence.FetchType.EAGER)
    @OrderColumn(name = "item_order")
    private List<OrderItem> items = new ArrayList<>();

    public Order() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCanteen() { return canteen; }
    public void setCanteen(String canteen) { this.canteen = canteen; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
