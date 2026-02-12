package com.flightbooking.modules.booking.service;

import com.flightbooking.modules.booking.dto.BookingRequest;
import com.flightbooking.modules.booking.dto.BookingResponse;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, Long userId);
}
