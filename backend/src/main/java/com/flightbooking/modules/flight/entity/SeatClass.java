package com.flightbooking.modules.flight.entity;

import com.flightbooking.common.entity.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "seat_classes", uniqueConstraints = @UniqueConstraint(columnNames = { "flight_id", "class_type" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatClass extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "class_type", nullable = false, columnDefinition = "seat_class_type")
    private SeatClassType classType;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "base_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    @Version
    @Column(nullable = false)
    private Integer version;

    public enum SeatClassType {
        ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    }
}
