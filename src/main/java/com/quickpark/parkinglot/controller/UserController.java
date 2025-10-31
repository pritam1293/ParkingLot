package com.quickpark.parkinglot.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.quickpark.parkinglot.service.IUserService;
import com.quickpark.parkinglot.entities.User;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/quickpark/api/user")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            // Register user and get JWT token
            String token = userService.registerUser(user);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("email", user.getEmail());
            response.put("token", token);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during signup: " + e.getMessage());
        }
    }

    @PostMapping("/auth/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String contactNo = loginRequest.get("contactNo");
            String password = loginRequest.get("password");

            // Validate user and get JWT token
            String token = userService.validateUser(email, contactNo, password);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User signed in successfully");
            response.put("email", email);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during signin: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestBody String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching profile: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestBody String email) {
        try {
            Map<String, List<Object>> history = userService.getUserParkingHistory(email);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching history: " + e.getMessage());
        }
    }
}
