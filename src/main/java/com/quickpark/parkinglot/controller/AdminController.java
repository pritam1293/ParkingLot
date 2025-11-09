package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.service.IAdminService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;
import com.quickpark.parkinglot.custom.Pair;

@RestController
@RequestMapping("/quickpark/admin/api")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }

    /*
     * Add new parking spots incrementally
     * Request body format: {"mini": 10, "compact": 20, "large": 5}
     * This will add the specified number of new spots for each type
     */
    @PostMapping("/add-parking-spots")
    public ResponseEntity<?> addParkingSpots(@RequestBody Map<String, Integer> parkingSpotRequest) {
        try {
            Map<String, Object> response = adminService.addParkingSpots(parkingSpotRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update-parking-spot")
    public ResponseEntity<?> updateParkingSpot(@RequestBody Map<String, Boolean> statusRequest) {
        try {
            Map<String, Object> response = adminService.updateParkingSpotStatus(statusRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all-parking-spots")
    public ResponseEntity<?> getAllParkingSpots() {
        try {
            Map<String, Object> response = adminService.getAllParkingSpots();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all-parked-spots")
    public ResponseEntity<?> getAllParkedSpots() {
        try {
            List<Pair> response = adminService.getAllParkedSpots();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all-available-spots")
    public ResponseEntity<?> getAllAvailableSpots() {
        try {
            List<Pair> response = adminService.getAllAvailableSpots();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/spots-by-active-status")
    public ResponseEntity<?> getAllSpotsByActiveStatus(@RequestParam boolean active) {
        try {
            if(active != true && active != false) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid active status parameter");
            }
            List<Pair> response = adminService.getAllSpotsByActiveStatus(active);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/revenue") 
    public ResponseEntity<?> calculateRevenue(@RequestParam String startDate, @RequestParam String endDate) {
        try {
            long revenue = adminService.calculateRevenueBetweenDates(startDate, endDate);
            return ResponseEntity.ok(Map.of("revenue", revenue));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
