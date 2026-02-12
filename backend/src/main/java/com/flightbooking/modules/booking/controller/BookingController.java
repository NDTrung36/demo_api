package com.flightbooking.modules.booking.controller;

import com.flightbooking.common.dto.ApiResponse;
import com.flightbooking.modules.booking.dto.BookingRequest;
import com.flightbooking.modules.booking.dto.BookingResponse;
import com.flightbooking.modules.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request) {

        System.out.println("==== BOOKING REQUEST RECEIVED ====");
        System.out.println("Flight ID: " + request.flightId());
        System.out.println("Seat Class: " + request.seatClassType());
        System.out.println("Passenger: " + request.passenger());
        System.out.println("==================================");

        // TODO: Get userId from authenticated user (JWT token)
        // For now, using a mock userId
        Long userId = 1L;

        BookingResponse response = bookingService.createBooking(request, userId);

        System.out.println("==== BOOKING CREATED SUCCESSFULLY ====");
        System.out.println("Booking Reference: " + response.bookingReference());
        System.out.println("======================================");

        return ResponseEntity.ok(
                ApiResponse.ok("Booking created successfully", response));
    }
}
