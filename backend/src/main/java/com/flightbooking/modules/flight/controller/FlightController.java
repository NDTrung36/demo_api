package com.flightbooking.modules.flight.controller;

import com.flightbooking.common.dto.ApiResponse;
import com.flightbooking.modules.flight.dto.FlightDto;
import com.flightbooking.modules.flight.dto.FlightSearchRequest;
import com.flightbooking.modules.flight.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FlightDto>>> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam LocalDate date,
            @RequestParam(defaultValue = "1") int passengers) {
        FlightSearchRequest request = new FlightSearchRequest(
                origin, destination, date, passengers);

        List<FlightDto> flights = flightService.searchFlights(request);
        return ResponseEntity.ok(ApiResponse.ok("Flights found: " + flights.size(), flights));
    }
}
