package com.flightbooking.modules.flight.service;

import com.flightbooking.modules.flight.dto.FlightDto;
import com.flightbooking.modules.flight.dto.FlightSearchRequest;

import java.util.List;

public interface FlightService {

    List<FlightDto> searchFlights(FlightSearchRequest request);
}
