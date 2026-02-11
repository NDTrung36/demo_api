package com.flightbooking.modules.flight.service;

import com.flightbooking.common.exception.BadRequestException;
import com.flightbooking.modules.flight.dto.FlightDto;
import com.flightbooking.modules.flight.dto.FlightSearchRequest;
import com.flightbooking.modules.flight.entity.Flight;
import com.flightbooking.modules.flight.entity.SeatClass;
import com.flightbooking.modules.flight.mapper.FlightMapper;
import com.flightbooking.modules.flight.repository.FlightRepository;
import com.flightbooking.modules.flight.repository.SeatClassRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;
    private final SeatClassRepository seatClassRepository;
    private final FlightMapper flightMapper;

    @Override
    public List<FlightDto> searchFlights(FlightSearchRequest request) {
        log.info("Searching flights: {} -> {} on {} for {} passengers",
                request.originCode(), request.destinationCode(),
                request.departureDate(), request.passengers());

        if (request.originCode().equalsIgnoreCase(request.destinationCode())) {
            throw new BadRequestException("Origin and destination cannot be the same");
        }

        LocalDate date = request.departureDate();
        OffsetDateTime startOfDay = date.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime endOfDay = date.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

        List<Flight> flights = flightRepository.searchFlights(
                request.originCode().toUpperCase(),
                request.destinationCode().toUpperCase(),
                startOfDay,
                endOfDay);

        List<FlightDto> results = new ArrayList<>();

        for (Flight flight : flights) {
            List<SeatClass> seatClasses = seatClassRepository.findByFlightId(flight.getId());

            for (SeatClass seatClass : seatClasses) {
                if (seatClass.getAvailableSeats() >= request.passengers()) {
                    results.add(flightMapper.toDto(flight, seatClass));
                }
            }
        }

        log.info("Found {} flight options", results.size());
        return results;
    }
}
