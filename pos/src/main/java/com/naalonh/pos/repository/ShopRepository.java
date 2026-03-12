package com.naalonh.pos.repository;

import com.naalonh.pos.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, UUID> {
    Optional<Shop> findByOwnerAuthId(UUID ownerAuthId);
    
    
}