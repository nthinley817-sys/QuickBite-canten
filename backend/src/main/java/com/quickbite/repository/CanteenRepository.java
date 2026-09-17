package com.quickbite.repository;

import com.quickbite.model.Canteen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CanteenRepository extends JpaRepository<Canteen, String> {
}
