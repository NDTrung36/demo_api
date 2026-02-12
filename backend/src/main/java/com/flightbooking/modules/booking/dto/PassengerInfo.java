package com.flightbooking.modules.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PassengerInfo(
        @NotBlank(message = "Full name is required") String fullName,

        @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,

        @NotBlank(message = "Phone is required") String phone,

        @NotBlank(message = "Passport number is required") String passportNumber,

        LocalDate dateOfBirth,

        String nationality) {
}
