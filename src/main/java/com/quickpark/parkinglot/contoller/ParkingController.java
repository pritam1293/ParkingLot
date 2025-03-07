package com.quickpark.parkinglot.contoller;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.service.IParkingService;
//import com.quickpark.parkinglot.DTO.ParkedVehicle;
import com.quickpark.parkinglot.service.ParkingService;
import org.springframework.web.bind.annotation.*;

@RestController
public class ParkingController {

    IParkingService parkingService;

    public ParkingController() {
        this.parkingService = new ParkingService();
    }

    @GetMapping("/home")
    public String home() {
        return "Welcome to the QUICK PARK parking lot, Have a nice day";
    }

    @GetMapping("/free-parking-spots")
    public DisplayResponse display() {
        return parkingService.getFreeParkingSpots();
    }

    @PostMapping(path = "/parking-lot/park" , consumes = "application/json")
    public Ticket ParkVehicle(@RequestBody BookRequest bookRequest) {
        return parkingService.ParkVehicle(bookRequest);
    }

    @DeleteMapping(path = "/parking-lot/unpark" , consumes = "application/json")
    public Ticket UnparkVehicle(@RequestBody Ticket ticket) {
        return parkingService.UnparkVehicle(ticket);
    }
}
