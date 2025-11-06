package com.quickpark.parkinglot.service;

import org.springframework.stereotype.Service;

import com.quickpark.parkinglot.entities.CompactParkingSpot;
import com.quickpark.parkinglot.entities.LargeParkingSpot;
import com.quickpark.parkinglot.entities.MiniParkingSpot;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.repository.ParkingSpotRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService implements IAdminService {

    private final ParkingSpotRepository parkingSpotRepository;

    public AdminService(ParkingSpotRepository parkingSpotRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
    }

    @Override
    public Map<String, Object> addParkingSpots(Map<String, Integer> parkingSpotRequest) {
        try {
            Map<String, Object> response = new HashMap<>();
            Map<String, Integer> addedSpots = new HashMap<>();
            int totalAdded = 0;

            // Process each type of parking spot request
            for (Map.Entry<String, Integer> entry : parkingSpotRequest.entrySet()) {
                String type = entry.getKey().toLowerCase();
                Integer count = entry.getValue();

                // Validate type
                if (!type.equals("mini") && !type.equals("compact") && !type.equals("large")) {
                    throw new RuntimeException(
                            "Invalid parking spot type: " + type + ". Allowed values: mini, compact, large");
                }

                // Validate count
                if (count == null || count <= 0) {
                    throw new RuntimeException("Invalid count for type " + type + ". Count must be greater than 0");
                }

                // Get the section number based on type
                int sectionNumber = getSectionNumber(type);

                // Get the next available position for this type
                Map<String, Integer> nextPosition = getNextAvailablePosition(type, sectionNumber);
                int nextRow = nextPosition.get("row");
                int nextCol = nextPosition.get("col");

                // Create and save the parking spots
                List<ParkingSpot> spotsToSave = new ArrayList<>();
                int maxColumnsPerRow = 10; // Define maximum columns per row

                for (int i = 0; i < count; i++) {
                    String location = String.format("S%d-R%d-C%d", sectionNumber, nextRow, nextCol);

                    // Check if location already exists (safety check)
                    if (parkingSpotRepository.existsByLocation(location)) {
                        throw new RuntimeException("Location " + location + " already exists. Data integrity issue.");
                    }

                    ParkingSpot spot = createParkingSpot(type, location);
                    spot.setActive(true);
                    spot.setBooked(false);
                    spot.setCreatedAt(LocalDateTime.now());
                    spot.setUpdatedAt(LocalDateTime.now());

                    spotsToSave.add(spot);

                    // Move to next position
                    nextCol++;
                    if (nextCol > maxColumnsPerRow) {
                        nextCol = 1;
                        nextRow++;
                    }
                }

                // Save all spots for this type
                parkingSpotRepository.saveAll(spotsToSave);
                addedSpots.put(type, count);
                totalAdded += count;
            }

            // Prepare response
            response.put("message", "Parking spots added successfully");
            response.put("added", addedSpots);
            response.put("totalAdded", totalAdded);
            response.put("currentTotals", getCurrentTotals());

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error adding parking spots: " + e.getMessage());
        }
    }

    /**
     * Get section number based on parking spot type
     */
    private int getSectionNumber(String type) {
        switch (type.toLowerCase()) {
            case "mini":
                return 1;
            case "compact":
                return 2;
            case "large":
                return 3;
            default:
                throw new RuntimeException("Invalid type: " + type);
        }
    }

    /**
     * Get the next available position (row, column) for a given type
     */
    private Map<String, Integer> getNextAvailablePosition(String type, int sectionNumber) {
        Map<String, Integer> position = new HashMap<>();

        // Get all existing spots of this type
        List<ParkingSpot> existingSpots = parkingSpotRepository.findByType(type);

        if (existingSpots.isEmpty()) {
            // No existing spots, start from S{section}-R1-C1
            position.put("row", 1);
            position.put("col", 1);
        } else {
            // Find the highest location
            int maxRow = 0;
            int maxCol = 0;

            for (ParkingSpot spot : existingSpots) {
                String location = spot.getLocation();
                String[] parts = location.split("-");

                int row = Integer.parseInt(parts[1].substring(1)); // Remove 'R'
                int col = Integer.parseInt(parts[2].substring(1)); // Remove 'C'

                if (row > maxRow || (row == maxRow && col > maxCol)) {
                    maxRow = row;
                    maxCol = col;
                }
            }

            // Calculate next position
            int maxColumnsPerRow = 10;
            maxCol++;
            if (maxCol > maxColumnsPerRow) {
                maxCol = 1;
                maxRow++;
            }

            position.put("row", maxRow);
            position.put("col", maxCol);
        }

        return position;
    }

    /**
     * Create a parking spot instance based on type
     */
    private ParkingSpot createParkingSpot(String type, String location) {
        switch (type.toLowerCase()) {
            case "mini":
                return new MiniParkingSpot(location);
            case "compact":
                return new CompactParkingSpot(location);
            case "large":
                return new LargeParkingSpot(location);
            default:
                throw new RuntimeException("Invalid type: " + type);
        }
    }

    /**
     * Get current totals of all parking spot types
     */
    private Map<String, Long> getCurrentTotals() {
        Map<String, Long> totals = new HashMap<>();
        totals.put("mini", parkingSpotRepository.findByType("mini").stream().count());
        totals.put("compact", parkingSpotRepository.findByType("compact").stream().count());
        totals.put("large", parkingSpotRepository.findByType("large").stream().count());
        totals.put("total", parkingSpotRepository.count());
        return totals;
    }
}