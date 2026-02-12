package com.flightbooking.modules.booking.dto;

import com.flightbooking.modules.booking.entity.Booking;
import com.flightbooking.modules.flight.dto.FlightDto;

import java.math.BigDecimal;

public record BookingResponse(
        Long id,
        String bookingReference,
        Booking.BookingStatus status,
        BigDecimal totalAmount,
        FlightDto flight,
        PassengerInfo passenger) {
}
