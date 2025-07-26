package com.quickpark.parkinglot.contoller;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.service.IParkingService;
import com.quickpark.parkinglot.service.ParkingService;
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

    IParkingService parkingService;

    public ParkingController() {
        this.parkingService = new ParkingService();
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
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Parking failed, not a valid data entry or no free spots available or a vehicle is already parked with the same number");
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
        
        // System.out.println("");
        // System.out.println("PUT request received at URL: /quickpark/update-ticket/" + ticketId);
        // System.out.println("Request method: PUT");
        // System.out.println(bookRequest);
        // System.out.println("");
        
        Ticket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, bookRequest);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed, invalid ticket ID or the vehicle is not parked or invalid request data");
        }
    }

    @GetMapping("/quickpark/admin/parked-vehicles")
    public List<Ticket> getParkedVehicles() {
        return parkingService.getParkedVehicles();
    }
}