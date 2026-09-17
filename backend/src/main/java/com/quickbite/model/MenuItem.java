package com.quickbite.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Mirrors the shape of MENU_SEED in the frontend's data/menu.js — same
 * field names (id, name, category, price, desc, image, available) so the
 * JSON this API returns needs no translation on the React side.
 */
@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    private String id;

    private String name;

    private String category;

    private int price;

    @Column(name = "item_desc", length = 1000)
    private String desc;

    @Column(length = 1000)
    private String image;

    private boolean available;

    public MenuItem() {
    }

    public MenuItem(String id, String name, String category, int price, String desc, String image, boolean available) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.desc = desc;
        this.image = image;
        this.available = available;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
