package com.naalonh.pos.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "product_option_groups")
public class ProductOptionGroup {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "option_group_id")
    private UUID optionGroupId;

    public UUID getId() {
        return id;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public UUID getOptionGroupId() {
        return optionGroupId;
    }

    public void setOptionGroupId(UUID optionGroupId) {
        this.optionGroupId = optionGroupId;
    }
}