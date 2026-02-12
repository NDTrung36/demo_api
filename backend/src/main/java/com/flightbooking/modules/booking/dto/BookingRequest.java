package com.flightbooking.modules.booking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookingRequest(
        @NotNull(message = "Flight ID is required") Long flightId,

        @NotBlank(message = "Seat class type is required") String seatClassType,

        @NotNull(message = "Passenger information is required") @Valid PassengerInfo passenger) {
}
