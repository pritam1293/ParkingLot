package com.quickpark.parkinglot.controller;

import com.quickpark.parkinglot.service.IAdminService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/quickpark/admin/api")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Add new parking spots incrementally
     * Request body format: {"mini": 10, "compact": 20, "large": 5}
     * This will add the specified number of new spots for each type
     * without deleting existing spots
     */
    @PostMapping("/add-parking-spots")
    public ResponseEntity<?> addParkingSpots(@RequestBody Map<String, Integer> parkingSpotRequest) {
        try {
            // Validate request
            if (parkingSpotRequest == null || parkingSpotRequest.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Request body cannot be empty. Provide spot types and counts (e.g., {\"mini\": 10, \"compact\": 20})");
            }

            // Call service to add parking spots
            Map<String, Object> response = adminService.addParkingSpots(parkingSpotRequest);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}
