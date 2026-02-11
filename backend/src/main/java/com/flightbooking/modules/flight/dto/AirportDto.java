package com.flightbooking.modules.flight.dto;

public record AirportDto(
        Long id,
        String code,
        String name,
        String city,
        String country) {
}
