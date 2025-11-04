package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.entities.CompactParkingSpot;
import com.quickpark.parkinglot.entities.LargeParkingSpot;
import com.quickpark.parkinglot.entities.MiniParkingSpot;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.repository.ParkingSpotRepository;
import com.quickpark.parkinglot.repository.ParkedTicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quickpark/api/admin/parking-spots")
public class AdminController {

    private final ParkingSpotRepository parkingSpotRepository;
    private final ParkedTicketRepository parkedTicketRepository;

    public AdminController(ParkingSpotRepository parkingSpotRepository,
            ParkedTicketRepository parkedTicketRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
        this.parkedTicketRepository = parkedTicketRepository;
    }

    /**
     * Initialize parking spots in database
     * WARNING: This will delete all existing parking spots
     */
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeParkingSpots() {
        try {
            // Check if there are active parked vehicles
            long activeVehicles = parkedTicketRepository.count();
            if (activeVehicles > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Cannot initialize: " + activeVehicles
                                + " vehicles are currently parked. Unpark all vehicles first.");
            }

            // Delete all existing spots
            parkingSpotRepository.deleteAll();

            // Create 50 mini parking spots
            for (int i = 1; i <= 50; i++) {
                parkingSpotRepository.save(new MiniParkingSpot(i));
            }

            // Create 75 compact parking spots
            for (int i = 51; i <= 125; i++) {
                parkingSpotRepository.save(new CompactParkingSpot(i));
            }

            // Create 25 large parking spots
            for (int i = 126; i <= 150; i++) {
                parkingSpotRepository.save(new LargeParkingSpot(i));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Parking spots initialized successfully");
            response.put("mini", 50);
            response.put("compact", 75);
            response.put("large", 25);
            response.put("total", 150);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error initializing parking spots: " + e.getMessage());
        }
    }

    /**
     * Reset all parking spots to unbooked status
     * WARNING: This will mark all spots as free
     */
    @PostMapping("/reset")
    public ResponseEntity<?> resetAllSpots() {
        try {
            // Check if there are active parked vehicles
            long activeVehicles = parkedTicketRepository.count();
            if (activeVehicles > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Cannot reset: " + activeVehicles
                                + " vehicles are currently parked. Unpark all vehicles first.");
            }

            List<ParkingSpot> allSpots = parkingSpotRepository.findAll();
            allSpots.forEach(spot -> spot.setBooked(false));
            parkingSpotRepository.saveAll(allSpots);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "All parking spots reset to available");
            response.put("total_reset", allSpots.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting parking spots: " + e.getMessage());
        }
    }

    /**
     * Get statistics about parking spots
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getParkingStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Overall stats
            long totalSpots = parkingSpotRepository.count();
            long availableSpots = parkingSpotRepository.countByIsBooked(false);
            long occupiedSpots = parkingSpotRepository.countByIsBooked(true);

            // Mini spots
            long totalMini = parkingSpotRepository.countByTypeAndIsBooked("mini", false) +
                    parkingSpotRepository.countByTypeAndIsBooked("mini", true);
            long availableMini = parkingSpotRepository.countByTypeAndIsBooked("mini", false);

            // Compact spots
            long totalCompact = parkingSpotRepository.countByTypeAndIsBooked("compact", false) +
                    parkingSpotRepository.countByTypeAndIsBooked("compact", true);
            long availableCompact = parkingSpotRepository.countByTypeAndIsBooked("compact", false);

            // Large spots
            long totalLarge = parkingSpotRepository.countByTypeAndIsBooked("large", false) +
                    parkingSpotRepository.countByTypeAndIsBooked("large", true);
            long availableLarge = parkingSpotRepository.countByTypeAndIsBooked("large", false);

            stats.put("total_spots", totalSpots);
            stats.put("available_spots", availableSpots);
            stats.put("occupied_spots", occupiedSpots);
            stats.put("occupancy_rate", totalSpots > 0 ? (occupiedSpots * 100.0 / totalSpots) : 0);

            Map<String, Object> miniStats = new HashMap<>();
            miniStats.put("total", totalMini);
            miniStats.put("available", availableMini);
            miniStats.put("occupied", totalMini - availableMini);
            stats.put("mini", miniStats);

            Map<String, Object> compactStats = new HashMap<>();
            compactStats.put("total", totalCompact);
            compactStats.put("available", availableCompact);
            compactStats.put("occupied", totalCompact - availableCompact);
            stats.put("compact", compactStats);

            Map<String, Object> largeStats = new HashMap<>();
            largeStats.put("total", totalLarge);
            largeStats.put("available", availableLarge);
            largeStats.put("occupied", totalLarge - availableLarge);
            stats.put("large", largeStats);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching stats: " + e.getMessage());
        }
    }

    /**
     * Get all parking spots with their status
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllParkingSpots() {
        try {
            List<ParkingSpot> allSpots = parkingSpotRepository.findAll();
            return ResponseEntity.ok(allSpots);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching parking spots: " + e.getMessage());
        }
    }

    /**
     * Get parking spots by type
     */
    @GetMapping("/by-type/{type}")
    public ResponseEntity<?> getSpotsByType(@PathVariable String type) {
        try {
            if (!type.equals("mini") && !type.equals("compact") && !type.equals("large")) {
                return ResponseEntity.badRequest()
                        .body("Invalid type. Allowed values: mini, compact, large");
            }

            List<ParkingSpot> spots = parkingSpotRepository.findByType(type);
            return ResponseEntity.ok(spots);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching parking spots: " + e.getMessage());
        }
    }
}
