package com.flightbooking.common.seeder;

import com.flightbooking.modules.flight.entity.*;
import com.flightbooking.modules.flight.repository.AirlineRepository;
import com.flightbooking.modules.flight.repository.AirportRepository;
import com.flightbooking.modules.flight.repository.FlightRepository;
import com.flightbooking.modules.flight.repository.SeatClassRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Component
@RequiredArgsConstructor
public class FlightDataSeeder implements CommandLineRunner {

    private final AirportRepository airportRepository;
    private final AirlineRepository airlineRepository;
    private final FlightRepository flightRepository;
    private final SeatClassRepository seatClassRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (airportRepository.count() > 0) {
            log.info("✈️  Data already seeded — skipping.");
            return;
        }

        log.info("🌱 Seeding flight data...");

        // ── Airports ──
        Airport han = airportRepository.save(Airport.builder()
                .code("HAN").name("Noi Bai International Airport")
                .city("Hanoi").country("Vietnam").timezone("Asia/Ho_Chi_Minh").build());

        Airport sgn = airportRepository.save(Airport.builder()
                .code("SGN").name("Tan Son Nhat International Airport")
                .city("Ho Chi Minh City").country("Vietnam").timezone("Asia/Ho_Chi_Minh").build());

        Airport dad = airportRepository.save(Airport.builder()
                .code("DAD").name("Da Nang International Airport")
                .city("Da Nang").country("Vietnam").timezone("Asia/Ho_Chi_Minh").build());

        log.info("   ✓ 3 airports created");

        // ── Airlines ──
        Airline vn = airlineRepository.save(Airline.builder()
                .code("VN").name("Vietnam Airlines").build());

        Airline vj = airlineRepository.save(Airline.builder()
                .code("VJ").name("Vietjet Air").build());

        log.info("   ✓ 2 airlines created");

        // ── Flights for next 7 days ──
        List<FlightRoute> routes = List.of(
                new FlightRoute(han, sgn, "VN", vn, 120), // HAN → SGN ~2h
                new FlightRoute(sgn, han, "VN", vn, 125), // SGN → HAN ~2h05
                new FlightRoute(han, dad, "VN", vn, 80), // HAN → DAD ~1h20
                new FlightRoute(dad, han, "VJ", vj, 85), // DAD → HAN ~1h25
                new FlightRoute(han, sgn, "VJ", vj, 115), // HAN → SGN ~1h55
                new FlightRoute(sgn, dad, "VJ", vj, 75) // SGN → DAD ~1h15
        );

        LocalTime[] departureTimes = {
                LocalTime.of(6, 0), LocalTime.of(8, 30),
                LocalTime.of(11, 0), LocalTime.of(14, 30),
                LocalTime.of(17, 0), LocalTime.of(20, 0)
        };

        int flightCount = 0;

        for (int day = 0; day < 7; day++) {
            LocalDate date = LocalDate.now().plusDays(day);

            for (FlightRoute route : routes) {
                // Pick a random departure time for variety
                LocalTime depTime = departureTimes[ThreadLocalRandom.current().nextInt(departureTimes.length)];
                OffsetDateTime departure = date.atTime(depTime).atOffset(ZoneOffset.ofHours(7)); // UTC+7
                OffsetDateTime arrival = departure.plusMinutes(route.durationMinutes);

                int flightNum = 100 + flightCount;
                String flightNumber = route.airlineCode + flightNum;

                Flight flight = flightRepository.save(Flight.builder()
                        .airline(route.airline)
                        .flightNumber(flightNumber)
                        .departureAirport(route.origin)
                        .arrivalAirport(route.destination)
                        .departureTime(departure)
                        .arrivalTime(arrival)
                        .status(Flight.FlightStatus.SCHEDULED)
                        .build());

                // Economy class
                seatClassRepository.save(SeatClass.builder()
                        .flight(flight)
                        .classType(SeatClass.SeatClassType.ECONOMY)
                        .totalSeats(180)
                        .availableSeats(150 + ThreadLocalRandom.current().nextInt(30))
                        .basePrice(BigDecimal.valueOf(850_000 + ThreadLocalRandom.current().nextInt(500_000)))
                        .version(0)
                        .build());

                // Business class
                seatClassRepository.save(SeatClass.builder()
                        .flight(flight)
                        .classType(SeatClass.SeatClassType.BUSINESS)
                        .totalSeats(24)
                        .availableSeats(12 + ThreadLocalRandom.current().nextInt(12))
                        .basePrice(BigDecimal.valueOf(2_500_000 + ThreadLocalRandom.current().nextInt(1_000_000)))
                        .version(0)
                        .build());

                flightCount++;
            }
        }

        log.info("   ✓ {} flights created with ECONOMY + BUSINESS classes", flightCount);
        log.info("🚀 Seeding complete!");
    }

    private record FlightRoute(Airport origin, Airport destination,
            String airlineCode, Airline airline,
            int durationMinutes) {
    }
}
