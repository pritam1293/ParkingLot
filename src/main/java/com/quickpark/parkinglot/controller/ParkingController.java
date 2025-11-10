package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.Exceptions.ParkingLotException;
import com.quickpark.parkinglot.config.JWT;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.service.IParkingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/quickpark/api/")
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

    @GetMapping("/status")
    public ResponseEntity<?> display() {    
        try {
            return ResponseEntity.ok(parkingService.getFreeParkingSpots());
        } catch (ParkingLotException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching free parking spots.");
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
            UnparkedTicket unparkedTicket = parkingService.UnparkVehicle(ticketId);
            if (unparkedTicket != null) {
                return ResponseEntity.ok(unparkedTicket);
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
    public ResponseEntity<?> UpdateParkedVehicle(@RequestParam String ticketId, @RequestBody String vehicleNo) {
        try {
            ParkedTicket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, vehicleNo);
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

    private String extractEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        return jwtUtil.extractEmail(token);
    }
}