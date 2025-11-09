package com.quickpark.parkinglot.service;

import java.util.Map;
import java.util.List;

import com.quickpark.parkinglot.entities.User;

public interface IUserService {
    Map<String, String> registerUser(Map<String, String> signupRequest);

    Map<String, String> validateUser(String email, String contactNo, String password);

    String updateUserDetails(String email,User user);

    User getUserByEmail(String email);

    Map<String, List<Object>> getUserParkingHistory(String email);
}
