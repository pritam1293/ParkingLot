package com.quickpark.parkinglot.service;

import java.util.Map;
import java.util.List;

import com.quickpark.parkinglot.entities.User;

public interface IUserService {
    String registerUser(User user);

    String validateUser(String email, String contactNo, String password);

    User getUserByEmail(String email);

    Map<String, List<Object>> getUserParkingHistory(String email);
}
