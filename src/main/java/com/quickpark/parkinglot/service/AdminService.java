package com.quickpark.parkinglot.service;

import org.springframework.stereotype.Service;

import com.quickpark.parkinglot.entities.CompactParkingSpot;
import com.quickpark.parkinglot.entities.LargeParkingSpot;
import com.quickpark.parkinglot.entities.MiniParkingSpot;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.repository.ParkingSpotRepository;
import com.quickpark.parkinglot.repository.UnparkedTicketRepository;
import com.quickpark.parkinglot.repository.ParkedTicketRepository;
import com.quickpark.parkinglot.custom.Pair;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService implements IAdminService {

    private final ParkingSpotRepository parkingSpotRepository;
    private final UnparkedTicketRepository unparkedTicketRepository;
    private final ParkedTicketRepository parkedTicketRepository;
    private final Validation validation;

    public AdminService(ParkingSpotRepository parkingSpotRepository, UnparkedTicketRepository unparkedTicketRepository,
            ParkedTicketRepository parkedTicketRepository, Validation validation) {
        this.parkingSpotRepository = parkingSpotRepository;
        this.unparkedTicketRepository = unparkedTicketRepository;
        this.parkedTicketRepository = parkedTicketRepository;
        this.validation = validation;
    }

    @Override
    public Map<String, Object> addParkingSpots(Map<String, Integer> parkingSpotRequest) {
        try {
            if (parkingSpotRequest == null || parkingSpotRequest.isEmpty()) {
                throw new RuntimeException(
                        "Request body cannot be empty. Provide spot types and counts (e.g., {\"mini\": 10, \"compact\": 20})");
            }
            Map<String, Object> response = new HashMap<>();
            Map<String, Integer> addedSpots = new HashMap<>();
            int totalAdded = 0;

            // Process each type of parking spot request
            for (Map.Entry<String, Integer> entry : parkingSpotRequest.entrySet()) {
                String type = entry.getKey().toLowerCase().trim();
                Integer count = entry.getValue();

                // Validate type
                if (!validation.isValidVehicleType(type)) {
                    throw new RuntimeException("Invalid parking spot type: " + type);
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

    // Get section number based on parking spot type
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

    // Get the next available position (row, column) for a given type
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

    // Create a parking spot instance based on type
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

    // Get current totals of all parking spot types (both active and inactive)
    private Map<String, Long> getCurrentTotals() {
        Map<String, Long> totals = new HashMap<>();
        totals.put("mini", parkingSpotRepository.findByType("mini").stream().count());
        totals.put("compact", parkingSpotRepository.findByType("compact").stream().count());
        totals.put("large", parkingSpotRepository.findByType("large").stream().count());
        totals.put("total", parkingSpotRepository.count());
        return totals;
    }

    @Override
    public Map<String, Object> updateParkingSpotStatus(Map<String, Boolean> statusRequest) {
        try {
            if (statusRequest == null || statusRequest.isEmpty()) {
                throw new RuntimeException("Status request cannot be null or empty");
            }
            Map<String, Object> response = new HashMap<>();
            List<String> updated = new ArrayList<>();
            List<String> notFound = new ArrayList<>();

            for (Map.Entry<String, Boolean> entry : statusRequest.entrySet()) {
                String location = entry.getKey();
                Boolean isActive = entry.getValue();
                if (location != null) {
                    location = location.trim();
                }

                if (location == null || location.isEmpty() || isActive == null) {
                    continue;
                }

                ParkingSpot spot = parkingSpotRepository.findByLocation(location);
                if (spot == null) {
                    notFound.add(location);
                    continue;
                }
                spot.setActive(isActive);
                spot.setUpdatedAt(LocalDateTime.now());
                parkingSpotRepository.save(spot);
                updated.add(location);
            }
            response.put("updated", updated);
            response.put("not_found", notFound);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error updating parking spot status: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getAllParkingSpots() {
        try {
            Map<String, Object> spotsByType = new HashMap<>();
            List<ParkingSpot> miniSpots = parkingSpotRepository.findByType("mini");
            List<ParkingSpot> compactSpots = parkingSpotRepository.findByType("compact");
            List<ParkingSpot> largeSpots = parkingSpotRepository.findByType("large");

            spotsByType.put("mini_count", miniSpots.size());
            spotsByType.put("compact_count", compactSpots.size());
            spotsByType.put("large_count", largeSpots.size());
            spotsByType.put("total_count", parkingSpotRepository.count());
            spotsByType.put("mini", miniSpots);
            spotsByType.put("compact", compactSpots);
            spotsByType.put("large", largeSpots);
            return spotsByType;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching parking spots: " + e.getMessage());
        }
    }

    // Return all parked spots with details of who booked them
    @Override
    public List<Pair> getAllParkedSpots() {
        try {
            List<Pair> parkedSpots = new ArrayList<>();
            List<ParkedTicket> miniSpots = parkedTicketRepository.findByParkingSpotType("mini");
            List<ParkedTicket> compactSpots = parkedTicketRepository.findByParkingSpotType("compact");
            List<ParkedTicket> largeSpots = parkedTicketRepository.findByParkingSpotType("large");

            parkedSpots.add(new Pair("mini_count", miniSpots.size()));
            parkedSpots.add(new Pair("compact_count", compactSpots.size()));
            parkedSpots.add(new Pair("large_count", largeSpots.size()));
            parkedSpots.add(new Pair("total_count", miniSpots.size() + compactSpots.size() + largeSpots.size()));
            parkedSpots.add(new Pair("mini", miniSpots));
            parkedSpots.add(new Pair("compact", compactSpots));
            parkedSpots.add(new Pair("large", largeSpots));
            return parkedSpots;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching parked spots: " + e.getMessage());
        }
    }

    @Override
    public List<Pair> getAllAvailableSpots() {
        try {
            List<Pair> availableSpots = new ArrayList<>();
            List<ParkingSpot> miniSpots = parkingSpotRepository.findByTypeAndIsBookedAndIsActive("mini", false, true);
            List<ParkingSpot> compactSpots = parkingSpotRepository.findByTypeAndIsBookedAndIsActive("compact", false, true);
            List<ParkingSpot> largeSpots = parkingSpotRepository.findByTypeAndIsBookedAndIsActive("large", false, true);
            availableSpots.add(new Pair("mini_count", miniSpots.size()));
            availableSpots.add(new Pair("compact_count", compactSpots.size()));
            availableSpots.add(new Pair("large_count", largeSpots.size()));
            availableSpots.add(new Pair("total_count", miniSpots.size() + compactSpots.size() + largeSpots.size()));
            availableSpots.add(new Pair("mini", miniSpots));
            availableSpots.add(new Pair("compact", compactSpots));
            availableSpots.add(new Pair("large", largeSpots));
            return availableSpots;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching available spots: " + e.getMessage());
        }
    }

    @Override
    public List<Pair> getAllSpotsByActiveStatus(boolean active) {
        try {
            List<Pair> spots = new ArrayList<>();
            List<ParkingSpot> miniSpots = parkingSpotRepository.findByTypeAndIsActive("mini", active);
            List<ParkingSpot> compactSpots = parkingSpotRepository.findByTypeAndIsActive("compact", active);
            List<ParkingSpot> largeSpots = parkingSpotRepository.findByTypeAndIsActive("large", active);
            spots.add(new Pair("mini_count", miniSpots.size()));
            spots.add(new Pair("compact_count", compactSpots.size()));
            spots.add(new Pair("large_count", largeSpots.size()));
            spots.add(new Pair("total_count", miniSpots.size() + compactSpots.size() + largeSpots.size()));
            spots.add(new Pair("mini", miniSpots));
            spots.add(new Pair("compact", compactSpots));
            spots.add(new Pair("large", largeSpots));
            return spots;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching spots by active status: " + e.getMessage());
        }
    }

    @Override
    public long calculateRevenueBetweenDates(String startDateStr, String endDateStr) {
        try {
            if (startDateStr != null) {
                startDateStr = startDateStr.trim();
            }
            if (endDateStr != null) {
                endDateStr = endDateStr.trim();
            }
            if( startDateStr == null || startDateStr.isEmpty()) {
                throw new RuntimeException("Start date cannot be null or empty");
            }
            if( endDateStr == null || endDateStr.isEmpty()) {
                throw new RuntimeException("End date cannot be null or empty");
            }
            if (!validation.isValidDateString(startDateStr)) {
                throw new RuntimeException("Invalid start date format. Expected format: YYYY-MM-DDTHH:MM:SS");
            }
            if (!validation.isValidDateString(endDateStr)) {
                throw new RuntimeException("Invalid end date format. Expected format: YYYY-MM-DDTHH:MM:SS");
            }
            LocalDateTime startDate = LocalDateTime.parse(startDateStr);
            LocalDateTime endDate = LocalDateTime.parse(endDateStr);
            List<UnparkedTicket> tickets = unparkedTicketRepository.findByExitTimeBetween(startDate, endDate);
            long totalRevenue = 0;
            for (UnparkedTicket ticket : tickets) {
                totalRevenue += ticket.getTotalCost();
            }
            return totalRevenue;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating revenue: " + e.getMessage());
        }
    }
}