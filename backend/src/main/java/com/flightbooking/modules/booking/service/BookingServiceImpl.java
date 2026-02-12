package com.flightbooking.modules.booking.service;

import com.flightbooking.common.exception.BadRequestException;
import com.flightbooking.common.exception.ResourceNotFoundException;
import com.flightbooking.modules.booking.dto.BookingRequest;
import com.flightbooking.modules.booking.dto.BookingResponse;
import com.flightbooking.modules.booking.dto.PassengerInfo;
import com.flightbooking.modules.booking.entity.Booking;
import com.flightbooking.modules.booking.entity.BookingFlightSegment;
import com.flightbooking.modules.booking.entity.BookingPassenger;
import com.flightbooking.modules.booking.repository.BookingRepository;
import com.flightbooking.modules.flight.dto.FlightDto;
import com.flightbooking.modules.flight.entity.Flight;
import com.flightbooking.modules.flight.entity.SeatClass;
import com.flightbooking.modules.flight.mapper.FlightMapper;
import com.flightbooking.modules.flight.repository.FlightRepository;
import com.flightbooking.modules.flight.repository.SeatClassRepository;
import com.flightbooking.modules.user.entity.User;
import com.flightbooking.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final SeatClassRepository seatClassRepository;
    private final UserRepository userRepository;
    private final FlightMapper flightMapper;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        log.info("Creating booking for user {} - Flight: {}, Seat Class: {}",
                userId, request.flightId(), request.seatClassType());

        // 1. Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Validate flight exists
        Flight flight = flightRepository.findById(request.flightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        // 3. Find seat class
        SeatClass seatClass = seatClassRepository.findByFlightIdAndClassType(
                request.flightId(),
                SeatClass.SeatClassType.valueOf(request.seatClassType().toUpperCase()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seat class " + request.seatClassType() + " not found for this flight"));

        // 4. Check availability
        if (seatClass.getAvailableSeats() < 1) {
            throw new BadRequestException("No seats available for " + request.seatClassType());
        }

        // 5. Decrement seat availability (optimistic locking will prevent
        // double-booking)
        seatClass.setAvailableSeats(seatClass.getAvailableSeats() - 1);
        seatClassRepository.save(seatClass);

        // 6. Generate booking reference
        String bookingReference = generateBookingReference();

        // 7. Create booking
        Booking booking = Booking.builder()
                .user(user)
                .bookingReference(bookingReference)
                .tripType(Booking.TripType.ONE_WAY)
                .status(Booking.BookingStatus.PENDING)
                .totalAmount(seatClass.getBasePrice())
                .build();

        booking = bookingRepository.save(booking);

        // 8. Create passenger
        PassengerInfo passengerInfo = request.passenger();
        BookingPassenger passenger = BookingPassenger.builder()
                .booking(booking)
                .fullName(passengerInfo.fullName())
                .dateOfBirth(passengerInfo.dateOfBirth())
                .passportNumber(passengerInfo.passportNumber())
                .nationality(passengerInfo.nationality())
                .build();

        booking.getPassengers().add(passenger);

        // 9. Create booking flight segment
        // Note: We're creating a simplified version without FlightSegment entity
        // In production, you'd link to actual FlightSegment records
        BookingFlightSegment segment = BookingFlightSegment.builder()
                .booking(booking)
                .flightSegment(null) // Simplified - would link to actual segment
                .seatClass(seatClass)
                .direction(BookingFlightSegment.SegmentDirection.OUTBOUND)
                .build();

        booking.getFlightSegments().add(segment);

        // 10. Save booking with all relationships
        booking = bookingRepository.save(booking);

        // 11. Map to response
        FlightDto flightDto = flightMapper.toDto(flight, seatClass);

        log.info("Booking created successfully - Reference: {}", bookingReference);

        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getStatus(),
                booking.getTotalAmount(),
                flightDto,
                passengerInfo);
    }

    private String generateBookingReference() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder reference = new StringBuilder("BK");

        for (int i = 0; i < 8; i++) {
            reference.append(chars.charAt(random.nextInt(chars.length())));
        }

        // Check uniqueness (retry if exists)
        String ref = reference.toString();
        if (bookingRepository.findByBookingReference(ref).isPresent()) {
            return generateBookingReference(); // Recursive retry
        }

        return ref;
    }
}
