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
            response.put("email", result.get("email"));
            response.put("role", result.get("role"));

            emailService.sendSignupEmail(
                    result.get("email"),
                    result.get("firstName"),
                    result.get("lastName"));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error during signup: " + e.getMessage());
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
            response.put("email", result.get("email"));
            response.put("token", result.get("token"));
            response.put("role", result.get("role"));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error during signin: " + e.getMessage());
        }
    }

    @PutMapping("/auth/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> requestBody,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);
            User updatedUser = userService.updateUserDetails(email, requestBody);
            try {
                emailService.sendUpdateEmail(
                        updatedUser.getEmail(),
                        updatedUser.getFirstName(),
                        updatedUser.getLastName());
            } catch (Exception e) {
                // Log the email sending failure but do not fail the update process
                System.out.println("");
                System.err.println("Failed to send update email: " + e.getMessage());
                System.err.println("email: " + updatedUser.getEmail());
                System.out.println("");
            }
            return ResponseEntity.ok("User updated successfully");
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }

    @PostMapping("/auth/otp/generate")
    public ResponseEntity<?> generateOTP(@RequestBody String email) {
        try {
            boolean isOTPSent = userService.generateAndSendOTP(email);
            if (isOTPSent) {
                return ResponseEntity.ok("OTP sent successfully to " + email);
            } else {
                throw new RuntimeException("Failed to send OTP");
            }
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error generating OTP: " + e.getMessage());
        }
    }

    @PostMapping("/auth/otp/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> otpRequest) {
        try {
            String email = otpRequest.get("email");
            String otp = otpRequest.get("otp");
            boolean isOTPValid = userService.verifyOTP(email, otp);
            if (isOTPValid) {
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                throw new RuntimeException("Invalid OTP");
            }
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error verifying OTP: " + e.getMessage());
        }
    }

    @PutMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> passwordRequest) {
        try {
            String email = passwordRequest.get("email");
            String newPassword = passwordRequest.get("newPassword");
            Map<String, Object> response = userService.resetPassword(email, newPassword);
            if ((boolean) response.get("success")) {
                // Send password change email
                String toEmail = (String) response.get("email");
                String firstName = (String) response.get("firstName");
                String lastName = (String) response.get("lastName");
                emailService.sendPasswordChangeEmail(toEmail, firstName, lastName);
                return ResponseEntity.ok("Password reset successfully");
            } else {
                throw new RuntimeException((String) response.get("message"));
            }
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error resetting password: " + e.getMessage());
        }
    }

    @PutMapping("/auth/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from JWT token
            String email = extractEmailFromToken(authHeader);
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");
            boolean isPasswordChanged = userService.changePassword(email, currentPassword, newPassword);
            if (isPasswordChanged) {
                return ResponseEntity.ok("Password changed successfully");
            } else {
                throw new RuntimeException("Failed to change password");
            }
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error changing password: " + e.getMessage());
        }
    }

    @PutMapping("/auth/reset-contact")
    public ResponseEntity<?> resetContactNumber(@RequestBody String newContactNumber,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            boolean isContactReset = userService.resetContactNumber(email, newContactNumber);
            if (isContactReset) {
                return ResponseEntity.ok("Contact number reset successfully");
            } else {
                throw new RuntimeException("Failed to reset contact number");
            }
        } catch (RuntimeException e) {
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error resetting contact number: " + e.getMessage());
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
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error fetching profile: " + e.getMessage());
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
            throw e; // Let global exception handler handle it
        } catch (Exception e) {
            throw new RuntimeException("Error fetching history: " + e.getMessage());
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
