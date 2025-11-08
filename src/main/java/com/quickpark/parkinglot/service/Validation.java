package com.quickpark.parkinglot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class Validation {

    @Value("${ADMIN_SECRET_KEY}")
    private String adminSecretKey;
    public Validation() {
    }

    public boolean isValidEmail(String email) {
        /*
        Simple regex for email validation
        Example: user@example.com
        */
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email != null && email.matches(emailRegex);
    }

    public boolean isValidContactNo(String contactNo) {
        /*
        A 10 digit contact number with no leading zero and starts with digits 6-9
        Example: 9876543210, 6123456789, 7890123456, 890123456
        */
        String contactNoRegex = "^[6-9][0-9]{9}$";
        return contactNo != null && contactNo.matches(contactNoRegex);
    }

    public boolean isValidPassword(String password) {
        /*
        Password length must be 6-15 characters, 
        containing at least one uppercase, one lowercase, one digit, 
        and one special character
        Example: Abc@1234
        */
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,15}$";
        return password != null && password.matches(passwordRegex);
    }

    public boolean isValidVehicleType(String vehicleType) {
        /*
        Vehicle type must be one of the following: mini, large, compact
        */
        return vehicleType != null && (vehicleType.equals("mini") || vehicleType.equals("large") || vehicleType.equals("compact"));
    }

    public boolean isVehicleNoValid(String vehicleNo) {
        /*
        Vehicle number format: Two uppercase letters, followed by two digits,
        followed by one or two uppercase letters, followed by four digits
        Example: AB12CD3456 or AB12C3456
        */
        String vehicleNoRegex = "^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$";
        return vehicleNo != null && vehicleNo.matches(vehicleNoRegex);
    }

    public int getCostByVehicleType(String vehicleType) {
        /*
        Returns the parking cost per hour based on vehicle type
        mini -> 20, compact -> 35, large -> 50
        */
        switch (vehicleType) {
            case "mini":
                return 20;
            case "compact":
                return 35;
            case "large":
                return 50;
            default:
                return 0;
        }
    }

    public boolean isAdminSecretKeyValid(String secretKey) {
        // admin secret key is subsequence of actual secret key
        int n = secretKey.length();
        if(n < 40 || n > 60) return false; // Length must be between 40 and 60
        int m = adminSecretKey.length();
        int i = 0, j = 0;
        while (i < n && j < m) {
            if (secretKey.charAt(i) == adminSecretKey.charAt(j)) {
                j++;
            }
            i++;
        }
        return j == m;
    }

    public boolean isValidDateString(String dateStr) {
        /*
        Validates date string in the format YYYY-MM-DDTHH:MM:SS
        Example: 
        Valid : 2025-11-09T10:30:00
        Invalid : 2025-13-99T25:61:99
        */
        String dateRegex = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$";
        if(!dateStr.matches(dateRegex)) return false;
        String year, month, day, hour, minute, second;
        try {
            year = dateStr.substring(0, 4);
            month = dateStr.substring(5, 7);
            day = dateStr.substring(8, 10);
            hour = dateStr.substring(11, 13);
            minute = dateStr.substring(14, 16);
            second = dateStr.substring(17, 19);
        } catch (Exception e) {
            return false; // Substring failed due to incorrect length
        }
        // Validate each component
        int currentYear = LocalDate.now().getYear();
        if (stringToInteger(year) > currentYear || stringToInteger(year) < 2020) return false;
        if (stringToInteger(month) < 1 || stringToInteger(month) > 12) return false;
        if (stringToInteger(day) < 1 || stringToInteger(day) > 31) return false;
        if (!isMonthAndDayValid(stringToInteger(year), stringToInteger(month), stringToInteger(day))) return false;
        if (stringToInteger(hour) < 0 || stringToInteger(hour) > 23) return false;
        if (stringToInteger(minute) < 0 || stringToInteger(minute) > 59) return false;
        if (stringToInteger(second) < 0 || stringToInteger(second) > 59) return false;
        return true;
    }

    private int stringToInteger(String str) {
        try {
            return Integer.parseInt(str);
        } catch (NumberFormatException e) {
            return -1; // Invalid integer
        }
    }

    private boolean isMonthAndDayValid(int year, int month, int day) {
        // Check for months with 30 days
        if (month == 4 || month == 6 || month == 9 || month == 11) {
            return day <= 30;
        }
        // Check for February
        if (month == 2) {
            // Leap year check
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                return day <= 29;
            } else {
                return day <= 28;
            }
        }
        return true; // Months with 31 days
    }
}
