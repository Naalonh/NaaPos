package com.naalonh.pos.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class CategoryResponseDTO {

    private UUID id;
    private String name;
    private String status;
    private Integer sortOrder;
    private OffsetDateTime createdAt;

    public CategoryResponseDTO(UUID id, String name, String status, Integer sortOrder, OffsetDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.sortOrder = sortOrder;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}