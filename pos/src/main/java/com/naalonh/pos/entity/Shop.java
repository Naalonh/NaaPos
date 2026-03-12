package com.naalonh.pos.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @Column(name = "owner_auth_id", nullable = false, unique = true)
    private UUID ownerAuthId;

    @Builder.Default
    private String currency = "USD";

    @Column(name = "tax_rate")
    @Builder.Default
    private Double taxRate = 0.0;

    @Column(name = "tax_enabled")
    @Builder.Default
    private Boolean taxEnabled = true;

    @Column(name = "prices_include_tax")
    @Builder.Default
    private Boolean pricesIncludeTax = false;

    @Column(name = "exchange_rate")
    @Builder.Default
    private Double exchangeRate = 1.0;

    @Builder.Default
    private String status = "pending";

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}