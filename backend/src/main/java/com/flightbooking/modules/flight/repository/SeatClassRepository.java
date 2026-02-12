package com.flightbooking.modules.flight.repository;

import com.flightbooking.modules.flight.entity.SeatClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatClassRepository extends JpaRepository<SeatClass, Long> {

    List<SeatClass> findByFlightId(Long flightId);

    Optional<SeatClass> findByFlightIdAndClassType(Long flightId, SeatClass.SeatClassType classType);
}
