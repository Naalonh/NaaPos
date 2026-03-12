package com.naalonh.pos.service;

import com.naalonh.pos.dto.RegisterOwnerRequest;
import com.naalonh.pos.entity.Role;
import com.naalonh.pos.entity.Shop;
import com.naalonh.pos.entity.Staff;
import com.naalonh.pos.repository.RoleRepository;
import com.naalonh.pos.repository.ShopRepository;
import com.naalonh.pos.repository.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final ShopRepository shopRepository;
    private final RoleRepository roleRepository;
    private final StaffRepository staffRepository;

    public RegistrationService(ShopRepository shopRepository,
                               RoleRepository roleRepository,
                               StaffRepository staffRepository) {
        this.shopRepository = shopRepository;
        this.roleRepository = roleRepository;
        this.staffRepository = staffRepository;
    }

    @Transactional
    public void registerOwner(RegisterOwnerRequest request) {

        // 1️⃣ Create Shop
        Shop shop = Shop.builder()
                .name(request.getShopName())
                .ownerAuthId(request.getAuthUserId())
                .status("pending")
                .build();

        shop = shopRepository.save(shop);

        // 2️⃣ Create Owner Role
        Role role = Role.builder()
                .shopId(shop.getId())
                .name("Owner")
                .build();

        role = roleRepository.save(role);

        // 3️⃣ Insert into Staff
        Staff staff = Staff.builder()
                .shopId(shop.getId())
                .authUserId(request.getAuthUserId())
                .roleId(role.getId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .isActive(true)
                .build();

        staffRepository.save(staff);
    }
}