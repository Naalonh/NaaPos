package com.naalonh.pos.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "option_groups")
public class OptionGroup {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "shop_id")
    private UUID shopId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "min_choice")
    private Integer minChoice = 0;

    @Column(name = "max_choice")
    private Integer maxChoice = 1;

    @Column(name = "required")
    private Boolean required = false;

    @Column(name = "status")
    private String status = "ACTIVE";

    public OptionGroup() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getShopId() {
        return shopId;
    }

    public void setShopId(UUID shopId) {
        this.shopId = shopId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getMinChoice() {
        return minChoice;
    }

    public void setMinChoice(Integer minChoice) {
        this.minChoice = minChoice;
    }

    public Integer getMaxChoice() {
        return maxChoice;
    }
    
    public void setMaxChoice(Integer maxChoice) {
        this.maxChoice = maxChoice;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}