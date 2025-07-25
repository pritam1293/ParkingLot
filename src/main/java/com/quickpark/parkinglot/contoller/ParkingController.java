package com.quickpark.parkinglot.contoller;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.service.IParkingService;
//import com.quickpark.parkinglot.DTO.ParkedVehicle;
import com.quickpark.parkinglot.service.ParkingService;

// import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;

@RestController
public class ParkingController {

    IParkingService parkingService;

    public ParkingController() {
        this.parkingService = new ParkingService();
    }

    @GetMapping("/quick-park/home")
    public String home() {
        return "Welcome to the QUICK PARK parking lot, Have a nice day";
    }

    @GetMapping("/quick-park/free-parking-spots")
    public DisplayResponse display() {
        return parkingService.getFreeParkingSpots();
    }

    @PostMapping(path = "/quick-park/park" , consumes = "application/json")
    public ResponseEntity<?> ParkVehicle(@RequestBody BookRequest bookRequest) {
        Ticket ticket = parkingService.ParkVehicle(bookRequest);

        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Parking failed, no free spots available");
        }
    }

    @DeleteMapping(path = "/quick-park/unpark" , consumes = "text/plain")
    public ResponseEntity<?> UnparkVehicle(@RequestBody String ticketId) {
        FreeRequest freeRequest = parkingService.UnparkVehicle(ticketId);
        if (freeRequest != null) {
            return ResponseEntity.ok(freeRequest);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unparking failed, invalid ticket ID or already unparked");
        }
    }

    @PutMapping(path = "/quick-park/update-ticket/{ticketId}/{vehicleNo}")
    public ResponseEntity<?> UpdateParkedVehicle(@PathVariable String ticketId, @PathVariable String vehicleNo) {
        Ticket updatedTicket = parkingService.UpdateParkedVehicle(ticketId, vehicleNo);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        } 
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed, invalid ticket ID or vehicle is not parked");
        }
    }
}
