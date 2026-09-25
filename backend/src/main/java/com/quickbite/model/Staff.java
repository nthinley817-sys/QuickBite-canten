package com.quickbite.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Staff login account. The frontend's demo login currently checks a
 * hardcoded "staff" / "staff123" pair client-side; this table lets that
 * become a real, database-backed check once the login page is wired up
 * (seeded with the same credentials so nothing breaks in the meantime).
 */
@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "staff_id", unique = true, nullable = false)
    private String staffId;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "canteen_id", nullable = false)
    private String canteenId;

    public Staff() {
    }

    public Staff(String staffId, String passwordHash, String canteenId) {
        this.staffId = staffId;
        this.passwordHash = passwordHash;
        this.canteenId = canteenId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getCanteenId() { return canteenId; }
    public void setCanteenId(String canteenId) { this.canteenId = canteenId; }
}
