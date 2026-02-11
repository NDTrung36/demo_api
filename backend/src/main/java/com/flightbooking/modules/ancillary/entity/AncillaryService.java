package com.flightbooking.modules.ancillary.entity;

import com.flightbooking.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ancillary_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AncillaryService extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ancillary_type")
    private AncillaryType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    public enum AncillaryType {
        BAGGAGE, MEAL, SEAT_SELECTION, INSURANCE, LOUNGE_ACCESS, PRIORITY_BOARDING
    }
}
