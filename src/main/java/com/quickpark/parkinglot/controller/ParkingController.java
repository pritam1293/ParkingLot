package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.Exceptions.ParkingLotException;
import com.quickpark.parkinglot.config.JWT;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.service.EmailService;
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
    private final EmailService emailService;

    public ParkingController(IParkingService parkingService, JWT jwtUtil, EmailService emailService) {
        this.parkingService = parkingService;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
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
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error fetching parking status: " + e.getMessage());
        }
    }

    @PostMapping(path = "/park", consumes = "application/json")
    public ResponseEntity<?> ParkVehicle(@RequestBody Map<String, String> requestBody,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userEmail = extractEmailFromToken(authHeader);
            if (userEmail == null || userEmail.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user token");
            }
            requestBody.put("email", userEmail);
            ParkedTicket ticket = parkingService.ParkVehicle(requestBody);
            // Send email notification (non-blocking)
            try {
                emailService.SendParkingTicketEmail(userEmail, ticket);
            } catch (Exception e) {
                // Log the email sending failure but do not fail the parking operation
                System.err.println("Failed to send parking ticket email to " + userEmail + ": " + e.getMessage());
            }
            return ResponseEntity.ok(ticket);
        } catch (ParkingLotException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error parking vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping(path = "/unpark")
    public ResponseEntity<?> UnparkVehicle(@RequestParam String ticketId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userEmail = extractEmailFromToken(authHeader);
            if (userEmail == null || userEmail.isEmpty()) {
                throw new RuntimeException("Invalid user token");
            }
            UnparkedTicket unparkedTicket = parkingService.UnparkVehicle(ticketId, userEmail);
            // Send email notification (non-blocking)
            try {
                emailService.sendUnparkingReceiptEmail(unparkedTicket.getEmail(), unparkedTicket);
            } catch (Exception e) {
                // Log the email sending failure but do not fail the unparking operation
                System.err.println("Failed to send unparking receipt email to " + unparkedTicket.getEmail() + ": "
                        + e.getMessage());
            }
            return ResponseEntity.ok(unparkedTicket);
        } catch (ParkingLotException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error unparking vehicle: " + e.getMessage());
        }
    }

    @PutMapping(path = "/update-ticket", consumes = "application/json")
    public ResponseEntity<?> UpdateParkedVehicle(@RequestParam String ticketId, @RequestBody String vehicleNo) {
        try {
            ParkedTicket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, vehicleNo);
            return ResponseEntity.ok(updatedTicket);
        } catch (ParkingLotException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error updating ticket: " + e.getMessage());
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