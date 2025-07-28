package com.quickpark.parkinglot.contoller;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.service.IParkingService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "*")
@RestController
public class ParkingController {

    private final IParkingService parkingService;

    public ParkingController(IParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping("/quickpark/home")
    public String home() {
        return "Welcome to the QUICK PARK parking lot, Have a nice day";
    }

    @GetMapping("/quickpark/free-parking-spots")
    public DisplayResponse display() {
        return parkingService.getFreeParkingSpots();
    }

    @PostMapping(path = "/quickpark/park" , consumes = "application/json")
    public ResponseEntity<?> ParkVehicle(@RequestBody BookRequest bookRequest) {
        Ticket ticket = parkingService.ParkVehicle(bookRequest);

        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Parking failed, no free spots available or a vehicle is already parked with the same number");
        }
    }

    @DeleteMapping(path = "/quickpark/unpark" , consumes = "text/plain")
    public ResponseEntity<?> UnparkVehicle(@RequestBody String ticketId) {
        FreeRequest freeRequest = parkingService.UnparkVehicle(ticketId);
        if (freeRequest != null) {
            return ResponseEntity.ok(freeRequest);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unparking failed, invalid ticket ID or the vehicle is already unparked");
        }
    }

    @PutMapping(path = "/quickpark/update-ticket/{ticketId}" , consumes = "application/json")
    public ResponseEntity<?> UpdateParkedVehicle(@PathVariable String ticketId, @RequestBody BookRequest bookRequest) {
        Ticket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, bookRequest);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed, invalid ticket ID or invalid request data");
        }
    }

    @GetMapping("/quickpark/admin/active-vehicles")
    public List<Ticket> getActiveParkedVehicles() {
        return parkingService.getActiveParkedVehicles();
    }

    @GetMapping("/quickpark/admin/completed-vehicles")
    public List<Ticket> getCompletedParkedVehicles() {
        return parkingService.getCompletedParkedVehicles();
    }

    @GetMapping("/quickpark/admin/all-vehicles")
    public List<Ticket> getAllParkedVehicles() {
        return parkingService.getAllParkedVehicles();
    }
}