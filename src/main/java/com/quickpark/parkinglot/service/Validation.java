package com.quickpark.parkinglot.service;

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
}
