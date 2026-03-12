package com.naalonh.pos.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class ProductResponseDTO {

    private UUID id;
    private UUID categoryId;
    private String name;
    private BigDecimal price;
    private String description;
    private String status;
    private String imageUrl;
    private String currency;

    private List<OptionGroupDTO> optionGroups;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<OptionGroupDTO> getOptionGroups() {
        return optionGroups;
    }

    public void setOptionGroups(List<OptionGroupDTO> optionGroups) {
        this.optionGroups = optionGroups;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}