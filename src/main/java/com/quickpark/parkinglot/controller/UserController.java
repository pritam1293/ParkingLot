package com.quickpark.parkinglot.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.quickpark.parkinglot.config.JWT;
import com.quickpark.parkinglot.service.EmailService;
import com.quickpark.parkinglot.service.IUserService;
import com.quickpark.parkinglot.entities.User;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/quickpark/api/user")
public class UserController {
    private final IUserService userService;
    private final JWT jwtUtil;
    private final EmailService emailService;

    public UserController(IUserService userService, JWT jwtUtil, EmailService emailService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> signupRequest) {
        try {
            // Register user and get JWT token
            Map<String, String> result = userService.registerUser(signupRequest);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("token", result.get("token"));
            
            emailService.sendSignupEmail(
                result.get("email"),
                result.get("firstName"), 
                result.get("lastName")
                );

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
            Map<String, String> result = userService.validateUser(email, contactNo, password);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User signed in successfully");
            response.put("email", email);
            response.put("token", result.get("token"));

            try {
                emailService.sendSigninEmail(
                    result.get("email"),
                    result.get("firstName"), 
                    result.get("lastName")
                );
            } catch (Exception e) {
                // Log the email sending failure but do not fail the signin process
                System.out.println("");
                System.err.println("Failed to send signin email: " + e.getMessage());
                System.err.println("email: " + result.get("email"));
                System.out.println("");
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during signin: " + e.getMessage());
        }
    }

    @PutMapping("/auth/update")
    public ResponseEntity<?> updateUser(@RequestBody User user, @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);
            Map<String, String> result = userService.updateUserDetails(email, user);

            try {
                emailService.sendUpdateEmail(
                    result.get("email"),
                    result.get("firstName"), 
                    result.get("lastName")
                );
            } catch (Exception e) {
                // Log the email sending failure but do not fail the update process
                System.out.println("");
                System.err.println("Failed to send update email: " + e.getMessage());
                System.err.println("email: " + result.get("email"));
                System.out.println("");
            }
            return ResponseEntity.ok("User updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user: " + e.getMessage());
        }
    }

    @PostMapping("/auth/otp/generate")
    public ResponseEntity<?> generateOTP(@RequestBody String email, @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String authEmail = extractEmailFromToken(authHeader);
            boolean isOTPSent = userService.generateAndSendOTP(email, authEmail);
            if (isOTPSent) {
                return ResponseEntity.ok("OTP sent successfully to " + email);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to send OTP");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating OTP: " + e.getMessage());
        }
    }

    @PostMapping("/auth/otp/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> otpRequest, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = otpRequest.get("email");
            String otp = otpRequest.get("otp");
            // Extract email from JWT token
            String authEmail = extractEmailFromToken(authHeader);
            boolean isOTPValid = userService.verifyOTP(email, authEmail, otp);
            if (isOTPValid) {
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying OTP: " + e.getMessage());
        }
    }

    @PutMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody String newPassword, @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);
            boolean isPasswordReset = userService.resetPassword(email, newPassword);
            if (isPasswordReset) {
                return ResponseEntity.ok("Password reset successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to reset password");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting password: " + e.getMessage());
        }
    }

    @PutMapping("/auth/reset-contact")
    public ResponseEntity<?> resetContactNumber(@RequestBody String newContactNo, @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);
            boolean isContactReset = userService.resetContactNumber(email, newContactNo);
            if (isContactReset) {
                return ResponseEntity.ok("Contact number reset successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to reset contact number");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting contact number: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);

            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching profile: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching profile: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);

            Map<String, List<Object>> history = userService.getUserParkingHistory(email);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching history: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching history: " + e.getMessage());
        }
    }

    // Helper method to extract email from JWT token
    private String extractEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        return jwtUtil.extractEmail(token);
    }
}
