package com.flightbooking.modules.flight.mapper;

import com.flightbooking.modules.flight.dto.AirportDto;
import com.flightbooking.modules.flight.entity.Airport;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AirportMapper {

    AirportDto toDto(Airport airport);
}
