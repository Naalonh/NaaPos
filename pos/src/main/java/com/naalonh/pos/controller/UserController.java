package com.naalonh.pos.controller;

import com.naalonh.pos.entity.Shop;
import com.naalonh.pos.entity.Staff;
import com.naalonh.pos.repository.ShopRepository;
import com.naalonh.pos.repository.StaffRepository;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final ShopRepository shopRepository;
    private final StaffRepository staffRepository;

    public UserController(ShopRepository shopRepository,
                          StaffRepository staffRepository) {
        this.shopRepository = shopRepository;
        this.staffRepository = staffRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());

        // 1️⃣ Check staff first
        Optional<Staff> staff = staffRepository.findByAuthUserId(userId);

        if (staff.isPresent()) {
            Staff s = staff.get();

            return Map.of(
                "fullName", s.getFullName(),
                "role", "Owner",
                "email", jwt.getClaim("email")
            );
        }

        // 2️⃣ fallback to shop owner
        Optional<Shop> shop = shopRepository.findByOwnerAuthId(userId);

        if (shop.isPresent()) {
            return Map.of(
                "fullName", shop.get().getName(),
                "role", "Owner",
                "email", jwt.getClaim("email")
            );
        }

        return Map.of(
            "fullName", jwt.getClaim("email"),
            "role", "User",
            "email", jwt.getClaim("email")
        );
    }
}