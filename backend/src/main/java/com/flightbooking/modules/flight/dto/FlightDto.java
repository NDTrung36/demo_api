package com.flightbooking.modules.flight.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record FlightDto(
        Long id,
        String flightNumber,
        String airlineName,
        String airlineCode,
        AirportDto departureAirport,
        AirportDto arrivalAirport,
        OffsetDateTime departureTime,
        OffsetDateTime arrivalTime,
        String duration,
        BigDecimal price,
        int availableSeats,
        String seatClassType) {
}
