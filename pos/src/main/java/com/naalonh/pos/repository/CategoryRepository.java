package com.naalonh.pos.repository;

import com.naalonh.pos.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    // Find all categories belonging to a specific shop, ordered by sort_order
    List<Category> findByShopIdOrderBySortOrderAsc(UUID shopId);

    // Find only active categories for a shop
    List<Category> findByShopIdAndStatusOrderBySortOrderAsc(UUID shopId, String status);
    
    boolean existsByShopIdAndNameIgnoreCase(UUID shopId, String name);

    // 🔹 Get max sort order for a shop
    @Query("SELECT COALESCE(MAX(c.sortOrder),0) FROM Category c WHERE c.shopId = :shopId")
    Integer findMaxSortOrderByShopId(UUID shopId);
}