package com.naalonh.pos.repository;

import com.naalonh.pos.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OptionRepository extends JpaRepository<Option, UUID> {

    List<Option> findByOptionGroupId(UUID optionGroupId);

    void deleteByOptionGroupId(UUID optionGroupId);
}