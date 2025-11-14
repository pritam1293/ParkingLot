package com.quickpark.parkinglot.service;

import java.util.Map;
import java.util.List;

import com.quickpark.parkinglot.entities.User;

public interface IUserService {
    Map<String, String> registerUser(Map<String, String> signupRequest);

    Map<String, String> validateUser(String email, String contactNo, String password);

    User updateUserDetails(String email, Map<String, String> userDetails);

    boolean generateAndSendOTP(String email);

    boolean verifyOTP(String email, String otp);

    Map<String, Object> resetPassword(String email, String newPassword);

    boolean changePassword(String email, String currentPassword, String newPassword);

    boolean resetContactNumber(String email, String newContactNo);

    User getUserByEmail(String email);

    Map<String, List<Object>> getUserParkingHistory(String email);
}
