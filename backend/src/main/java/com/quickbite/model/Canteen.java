package com.quickbite.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Mirrors CANTEENS in data/canteens.js: id, name, location, desc, image. */
@Entity
@Table(name = "canteens")
public class Canteen {

    @Id
    private String id;

    private String name;

    private String location;

    @Column(name = "canteen_desc", length = 1000)
    private String desc;

    @Column(length = 1000)
    private String image;

    public Canteen() {
    }

    public Canteen(String id, String name, String location, String desc, String image) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.desc = desc;
        this.image = image;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
