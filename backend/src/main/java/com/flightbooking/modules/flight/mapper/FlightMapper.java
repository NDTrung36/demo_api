package com.flightbooking.modules.flight.mapper;

import com.flightbooking.modules.flight.dto.FlightDto;
import com.flightbooking.modules.flight.entity.Flight;
import com.flightbooking.modules.flight.entity.SeatClass;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Duration;
import java.time.OffsetDateTime;

@Mapper(componentModel = "spring", uses = { AirportMapper.class })
public interface FlightMapper {

    @Mapping(target = "id", source = "flight.id")
    @Mapping(target = "airlineName", source = "flight.airline.name")
    @Mapping(target = "airlineCode", source = "flight.airline.code")
    @Mapping(target = "departureAirport", source = "flight.departureAirport")
    @Mapping(target = "arrivalAirport", source = "flight.arrivalAirport")
    @Mapping(target = "duration", source = "flight", qualifiedByName = "calculateDuration")
    @Mapping(target = "price", source = "seatClass.basePrice")
    @Mapping(target = "availableSeats", source = "seatClass.availableSeats")
    @Mapping(target = "seatClassType", source = "seatClass.classType")
    @Mapping(target = "flightNumber", source = "flight.flightNumber")
    @Mapping(target = "departureTime", source = "flight.departureTime")
    @Mapping(target = "arrivalTime", source = "flight.arrivalTime")
    FlightDto toDto(Flight flight, SeatClass seatClass);

    @Named("calculateDuration")
    default String calculateDuration(Flight flight) {
        OffsetDateTime departure = flight.getDepartureTime();
        OffsetDateTime arrival = flight.getArrivalTime();
        Duration duration = Duration.between(departure, arrival);
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        return String.format("%dh %02dm", hours, minutes);
    }
}
