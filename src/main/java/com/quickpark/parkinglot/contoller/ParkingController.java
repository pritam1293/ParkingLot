package com.quickpark.parkinglot.contoller;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.service.IParkingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
        ParkedTicket ticket = parkingService.ParkVehicle(bookRequest);

        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Parking failed, no free spots available or a vehicle is already parked with the same number");
        }
    }

    @DeleteMapping(path = "/unpark/{ticketId}")
    public ResponseEntity<?> UnparkVehicle(@PathVariable String ticketId) {
        FreeRequest freeRequest = parkingService.UnparkVehicle(ticketId);
        if (freeRequest != null) {
            return ResponseEntity.ok(freeRequest);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unparking failed, invalid ticket ID or the vehicle is already unparked");
        }
    }

    @PutMapping(path = "/update-ticket/{ticketId}" , consumes = "application/json")
    public ResponseEntity<?> UpdateParkedVehicle(@PathVariable String ticketId, @RequestBody BookRequest bookRequest) {
        ParkedTicket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, bookRequest);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed, invalid ticket ID or invalid request data");
        }
    }

    @GetMapping("/admin/validate-admin/{username}/{password}")
    public boolean validateAdmin(@PathVariable String username, @PathVariable String password) {
        return parkingService.validateAdminCredentials(username, password);
    }

    @GetMapping("/admin/active-vehicles")
    public List<ParkedTicket> getActiveParkedVehicles() {
        return parkingService.getActiveParkedVehicles();
    }

    @GetMapping("/admin/completed-vehicles")
    public List<UnparkedTicket> getCompletedParkedVehicles() {
        return parkingService.getCompletedParkedVehicles();
    }

    @GetMapping("/admin/unparked-today")
    public long countCompletedVehiclesToday() {
        return parkingService.countCompletedVehiclesToday();
    }

    @GetMapping("/admin/revenue-today")
    public long countRevenueToday() {
        return parkingService.countRevenueToday();
    }

    @GetMapping("/admin/revenue-week")
    public long countRevenueThisWeek() {
        return parkingService.countRevenueThisWeek();
    }

    @GetMapping("/admin/revenue-month")
    public long countRevenueThisMonth() {
        return parkingService.countRevenueThisMonth();
    }
}