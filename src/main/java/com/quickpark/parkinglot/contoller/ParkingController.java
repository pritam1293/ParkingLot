package com.quickpark.parkinglot.contoller;

import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.service.IParkingService;
import com.quickpark.parkinglot.service.ParkingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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


}
