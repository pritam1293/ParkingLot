package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {

    // Find all spots by type
    List<ParkingSpot> findByType(String type);

    // Find spots by type and booking status
    List<ParkingSpot> findByTypeAndIsBooked(String type, boolean isBooked);

    // Find spots by type and active status
    List<ParkingSpot> findByTypeAndIsActive(String type, boolean isActive);

    List<ParkingSpot> findByTypeAndIsBookedAndIsActive(String type, boolean isBooked, boolean isActive);

    // Find first available spot by type
    Optional<ParkingSpot> findFirstByTypeAndIsBooked(String type, boolean isBooked);

    // Find by location
    ParkingSpot findByLocation(String location);

    // Check if location exists
    boolean existsByLocation(String location);

    // Find last spot by type ordered by location
    Optional<ParkingSpot> findFirstByTypeOrderByLocationDesc(String type);

    // Count spots by type and booking status
    long countByTypeAndIsBooked(String type, boolean isBooked);

    // Count all available (unbooked) spots
    long countByIsBooked(boolean isBooked);
}
