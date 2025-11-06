package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.ParkingSpot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpotRepository extends MongoRepository<ParkingSpot, String> {

    // Find all spots by type
    List<ParkingSpot> findByType(String type);

    // Find spots by type and booking status
    List<ParkingSpot> findByTypeAndIsBooked(String type, boolean isBooked);

    // Find first available spot by type
    Optional<ParkingSpot> findFirstByTypeAndIsBooked(String type, boolean isBooked);

    // Find by location
    Optional<ParkingSpot> findByLocation(String location);

    // Find by type and location
    Optional<ParkingSpot> findByTypeAndLocation(String type, String location);

    // Check if location exists
    boolean existsByLocation(String location);

    // Find last spot by type ordered by location
    Optional<ParkingSpot> findFirstByTypeOrderByLocationDesc(String type);

    // Count spots by type and booking status
    long countByTypeAndIsBooked(String type, boolean isBooked);

    // Count all available (unbooked) spots
    long countByIsBooked(boolean isBooked);
}
