package com.naalonh.pos.repository;

import com.naalonh.pos.entity.ProductOptionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProductOptionGroupRepository
        extends JpaRepository<ProductOptionGroup, UUID> {

    List<ProductOptionGroup> findByProductId(UUID productId);

    void deleteByProductId(UUID productId);

    boolean existsByProductIdAndOptionGroupId(UUID productId, UUID optionGroupId);
    
    void deleteByProductIdAndOptionGroupId(UUID productId, UUID optionGroupId);
}