package com.flightbooking.modules.booking.entity;

import com.flightbooking.common.entity.BaseEntity;
import com.flightbooking.modules.flight.entity.FlightSegment;
import com.flightbooking.modules.flight.entity.SeatClass;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.*;

@Entity
@Table(name = "booking_flight_segments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingFlightSegment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_segment_id", nullable = false)
    private FlightSegment flightSegment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_class_id", nullable = false)
    private SeatClass seatClass;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "segment_direction")
    private SegmentDirection direction;

    public enum SegmentDirection {
        OUTBOUND, RETURN
    }
}
