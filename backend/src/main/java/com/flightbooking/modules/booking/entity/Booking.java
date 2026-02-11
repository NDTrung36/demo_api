package com.flightbooking.modules.booking.entity;

import com.flightbooking.common.entity.BaseEntity;
import com.flightbooking.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 10)
    private String bookingReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "trip_type", nullable = false, columnDefinition = "trip_type")
    private TripType tripType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "booking_status")
    private BookingStatus status;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BookingFlightSegment> flightSegments = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BookingPassenger> passengers = new ArrayList<>();

    public enum TripType {
        ONE_WAY, ROUND_TRIP
    }

    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED, EXPIRED
    }
}
