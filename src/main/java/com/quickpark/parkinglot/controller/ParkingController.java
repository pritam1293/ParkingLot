package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.Exceptions.ParkingLotException;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.service.IParkingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/quickpark/api")
public class ParkingController {

    private final IParkingService parkingService;

    public ParkingController(IParkingService parkingService) {
        this.parkingService = parkingService;
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
    public ResponseEntity<?> ParkVehicle(@RequestBody BookRequest bookRequest) {
        try {
            ParkedTicket ticket = parkingService.ParkVehicle(bookRequest);
            if(ticket != null) {
                return ResponseEntity.ok(ticket);
            } else {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Parking failed");
            }
        } catch (ParkingLotException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while parking the vehicle.");
        }
    }

    @DeleteMapping(path = "/unpark/{ticketId}")
    public ResponseEntity<?> UnparkVehicle(@PathVariable String ticketId) {
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

    @PutMapping(path = "/update-ticket/{ticketId}" , consumes = "application/json")
    public ResponseEntity<?> UpdateParkedVehicle(@PathVariable String ticketId, @RequestBody BookRequest bookRequest) {
        try {
            ParkedTicket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, bookRequest);
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
}