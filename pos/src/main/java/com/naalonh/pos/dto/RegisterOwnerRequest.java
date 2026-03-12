package com.naalonh.pos.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class RegisterOwnerRequest {

    private UUID authUserId;  // Comes from Supabase
    private String shopName;
    private String fullName;
    private String phone;
}