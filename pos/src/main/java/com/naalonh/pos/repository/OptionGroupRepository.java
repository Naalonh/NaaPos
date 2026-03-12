package com.naalonh.pos.repository;

import com.naalonh.pos.entity.OptionGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OptionGroupRepository extends JpaRepository<OptionGroup, UUID> {

    List<OptionGroup> findByShopId(UUID shopId);

}