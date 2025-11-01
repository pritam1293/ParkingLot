package com.quickpark.parkinglot.service;

import org.springframework.stereotype.Service;

@Service
public class Validation {
    public Validation() {
    }

    public boolean isValidEmail(String email) {
        // Simple regex for email validation
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email != null && email.matches(emailRegex);
    }

    public boolean isValidContactNo(String contactNo) {
        // A 10 digit contact number with no leading zero and starts with digits 6-9
        String contactNoRegex = "^[6-9][0-9]{9}$";
        return contactNo != null && contactNo.matches(contactNoRegex);
    }

    public boolean isValidPassword(String password) {
        /*Password length must be 6-15 characters, 
        containing at least one uppercase, one lowercase, one digit, 
        and one special character*/
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,15}$";
        return password != null && password.matches(passwordRegex);
    }
}
