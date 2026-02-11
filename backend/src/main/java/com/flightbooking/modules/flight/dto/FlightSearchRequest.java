package com.flightbooking.modules.flight.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record FlightSearchRequest(
        @NotBlank(message = "Origin airport code is required") String originCode,

        @NotBlank(message = "Destination airport code is required") String destinationCode,

        @NotNull(message = "Departure date is required") LocalDate departureDate,

        @Min(value = 1, message = "At least 1 passenger is required") int passengers) {
}
