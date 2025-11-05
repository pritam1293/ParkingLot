package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.Exceptions.ParkingLotException;
import com.quickpark.parkinglot.config.JWT;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.service.IParkingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/quickpark/api")
public class ParkingController {

    private final IParkingService parkingService;
    private final JWT jwtUtil;

    public ParkingController(IParkingService parkingService, JWT jwtUtil) {
        this.parkingService = parkingService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/home")
    public String home() {
        return "Welcome to the QUICK PARK parking lot, Have a nice day";
    }

    @GetMapping("/free-parking-spots")
    public ResponseEntity<?> display() {    
        try {
            return ResponseEntity.ok(parkingService.getFreeParkingSpots());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching free parking spots.");
        }
    }

    @PostMapping(path = "/park" , consumes = "application/json")
    public ResponseEntity<?> ParkVehicle(@RequestBody Map<String, String> requestBody, @RequestHeader("Authorization") String authHeader) {
        try {
            String userEmail = extractEmailFromToken(authHeader);
            if(userEmail == null || userEmail.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user token");
            }
            requestBody.put("email", userEmail);
            ParkedTicket ticket = parkingService.ParkVehicle(requestBody);
            if(ticket != null) {
                return ResponseEntity.ok(ticket);
            } else {
                // Return the actual error instead of a generic message
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Parking failed");
            }
        } catch (ParkingLotException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while parking the vehicle.");
        }
    }

    @DeleteMapping(path = "/unpark")
    public ResponseEntity<?> UnparkVehicle(@RequestParam String ticketId) {
        try {
            FreeRequest freeRequest = parkingService.UnparkVehicle(ticketId);
            if (freeRequest != null) {
                return ResponseEntity.ok(freeRequest);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unparking failed");
            }
        } catch (ParkingLotException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while unparking the vehicle.");
        }
    }

    @PutMapping(path = "/update-ticket" , consumes = "application/json")
    public ResponseEntity<?> UpdateParkedVehicle(@RequestParam String ticketId, @RequestBody Map<String, String> requestBody) {
        try {
            ParkedTicket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, requestBody);
            if (updatedTicket != null) {
                return ResponseEntity.ok(updatedTicket);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed");
            }
        } catch (ParkingLotException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the parked vehicle.");
        }
    }

    @GetMapping("/admin/validate-admin/{username}/{password}")
    public boolean validateAdmin(@PathVariable String username, @PathVariable String password) {
        try {
            return parkingService.validateAdminCredentials(username, password);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/admin/active-vehicles")
    public List<ParkedTicket> getActiveParkedVehicles() {
        try {
            return parkingService.getActiveParkedVehicles();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/admin/completed-vehicles")
    public List<UnparkedTicket> getCompletedParkedVehicles() {
        try {
            return parkingService.getCompletedParkedVehicles();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/admin/unparked-today")
    public long countCompletedVehiclesToday() {
        try {
            return parkingService.countCompletedVehiclesToday();
        } catch (Exception e) {
            return 0;
        }
    }

    @GetMapping("/admin/revenue-today")
    public long countRevenueToday() {
        try {
            return parkingService.countRevenueToday();
        } catch (Exception e) {
            return 0;
        }
    }

    @GetMapping("/admin/revenue-week")
    public long countRevenueThisWeek() {
        try {
            return parkingService.countRevenueThisWeek();
        } catch (Exception e) {
            return 0;
        }
    }

    @GetMapping("/admin/revenue-month")
    public long countRevenueThisMonth() {
        try {
            return parkingService.countRevenueThisMonth();
        } catch (Exception e) {
            return 0;
        }
    }

    private String extractEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing Authorization header");
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        return jwtUtil.extractEmail(token);
    }
}