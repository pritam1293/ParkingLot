package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.entities.User;

public interface IUserService {
    String registerUser(User user);

    String validateUser(String email, String contactNo, String password);
}
