package com.flightbooking.modules.flight.repository;

import com.flightbooking.modules.flight.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long>, JpaSpecificationExecutor<Flight> {

  @Query("""
      SELECT f FROM Flight f
      JOIN FETCH f.departureAirport da
      JOIN FETCH f.arrivalAirport aa
      JOIN FETCH f.airline al
      WHERE da.code = :originCode
        AND aa.code = :destinationCode
        AND f.departureTime >= :startOfDay
        AND f.departureTime < :endOfDay
        AND f.status = 'SCHEDULED'
      ORDER BY f.departureTime ASC
      """)
  List<Flight> searchFlights(
      @Param("originCode") String originCode,
      @Param("destinationCode") String destinationCode,
      @Param("startOfDay") OffsetDateTime startOfDay,
      @Param("endOfDay") OffsetDateTime endOfDay);

  List<Flight> findByFlightNumber(String flightNumber);
}
