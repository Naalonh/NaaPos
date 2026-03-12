package com.naalonh.pos.repository;

import com.naalonh.pos.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, UUID> {

    Optional<Staff> findByAuthUserId(UUID authUserId);

}
