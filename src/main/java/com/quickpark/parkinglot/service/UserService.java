package com.quickpark.parkinglot.service;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import com.quickpark.parkinglot.config.JWT;
import com.quickpark.parkinglot.entities.User;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.repository.ParkedTicketRepository;
import com.quickpark.parkinglot.repository.UnparkedTicketRepository;
import com.quickpark.parkinglot.repository.UserRepository;
import com.quickpark.parkinglot.Exceptions.*;
import jakarta.mail.SendFailedException;
import org.springframework.dao.DuplicateKeyException;

@Service
public class UserService implements IUserService {

    private PasswordEncoder passwordEncoder;
    private JWT jwtUtil;
    private final UserRepository userRepository;
    private final Validation validation;
    private final ParkedTicketRepository parkedTicketRepository;
    private final UnparkedTicketRepository unparkedTicketRepository;
    private final EmailService emailService;

    public UserService(PasswordEncoder passwordEncoder, JWT jwtUtil, UserRepository userRepository,
            Validation validation, ParkedTicketRepository parkedTicketRepository,
            UnparkedTicketRepository unparkedTicketRepository, EmailService emailService) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.parkedTicketRepository = parkedTicketRepository;
        this.unparkedTicketRepository = unparkedTicketRepository;
        this.emailService = emailService;
        this.validation = validation;
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized Map<String, String> registerUser(Map<String, String> signupRequest) {
        try {
            String firstName = signupRequest.get("firstName");
            String lastName = signupRequest.get("lastName");
            String email = signupRequest.get("email");
            String contactNo = signupRequest.get("contactNo");
            String password = signupRequest.get("password");
            String address = signupRequest.get("address");
            String secretKey = signupRequest.get("secretKey");
            String role = "USER"; // Default role is USER, will be changed to ADMIN if valid secret key is provided
            // Trim the trailing and leading spaces from all string fields
            if (firstName != null) {
                firstName = firstName.trim();
            }
            if (lastName != null) {
                lastName = lastName.trim();
            }
            if (email != null) {
                email = email.trim();
            }
            if (contactNo != null) {
                contactNo = contactNo.trim();
            }
            if (password != null) {
                password = password.trim();
            }
            if (address != null) {
                address = address.trim();
            }
            if (secretKey != null) {
                secretKey = secretKey.trim();
            }
            // Mandatory fields check
            if(firstName == null || firstName.isEmpty()) {
                throw new ValidationException("First name is required");
            }
            if(lastName == null || lastName.isEmpty()) {
                lastName = ""; // Set last name to empty string if not provided
            }
            if(address == null || address.isEmpty()) {
                throw new ValidationException("Address is required");
            }
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (validation.isValidEmail(email) == false) {
                throw new ValidationException("Invalid email format");
            }
            if (contactNo == null || contactNo.isEmpty()) {
                throw new ValidationException("Contact number is required");
            }
            if (validation.isValidContactNo(contactNo) == false) {
                throw new ValidationException("Invalid contact number format");
            }
            if (password == null || password.isEmpty()) {
                throw new ValidationException("Password is required");
            }
            if (validation.isValidPassword(password) == false) {
                throw new ValidationException(
                        "Invalid password format, password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            }
            
            if (secretKey != null && !secretKey.isEmpty()) {
                /*
                 * If secret key is provided, check if it is valid for admin user creation
                 * The provided secret key should also contain extra characters to avoid easy guessing
                 * So the actual admin secret key is subsequence of the provided secret key
                 * The length of the provided secret key should be between 40 to 60 characters
                 */
                if (!validation.isAdminSecretKeyValid(secretKey)) {
                    throw new AuthenticationException("Invalid admin secret key");
                }
                role = "ADMIN"; // Promote to ADMIN role
            }
            // Check if user with same email or contact number already exists
            if (userRepository.existsByEmail(email)) {
                throw new DuplicateResourceException("User with this email already exists");
            }
            if (userRepository.existsByContactNo(contactNo)) {
                throw new DuplicateResourceException("User with this contact number already exists");
            }
            // Create new user
            User newUser = new User(
                    firstName,
                    lastName,
                    email,
                    contactNo,
                    passwordEncoder.encode(password),
                    address,
                    role,
                    LocalDateTime.now(),
                    null,
                    null);

            userRepository.save(newUser);
            // Generate JWT token with roles
            String token = jwtUtil.generateToken(email, role);
            return Map.of(
                    "email", email,
                    "token", token,
                    "firstName", newUser.getFirstName(),
                    "lastName", newUser.getLastName(),
                    "role", role
                );
        } catch (Exception e) {
            throw new RuntimeException("Error registering user: " + e.getMessage());
        }
    }

    @Override
    public Map<String, String> validateUser(String email, String contactNo, String password) {
        try {
            // Trim the trailing and leading spaces from all string fields
            if (email != null) {
                email = email.trim();
            }
            if (contactNo != null) {
                contactNo = contactNo.trim();
            }
            if (password != null) {
                password = password.trim();
            }
            if (password == null || password.isEmpty()) {
                throw new ValidationException("Password is required");
            }
            User user = null;

            // If email is provided, validate using email
            if (email != null && !email.isEmpty()) {
                if (!validation.isValidEmail(email)) {
                    throw new ValidationException("Invalid email format");
                }
                user = userRepository.findByEmail(email);
                if (user == null) {
                    throw new ResourceNotFoundException("User with this email does not exist");
                }
            }
            // If contact number is provided, validate using contact number
            else if (contactNo != null && !contactNo.isEmpty()) {
                if (!validation.isValidContactNo(contactNo)) {
                    throw new ValidationException("Invalid contact number format");
                }
                user = userRepository.findByContactNo(contactNo);
                if (user == null) {
                    throw new ResourceNotFoundException("User with this contact number does not exist");
                }
            } else {
                throw new ValidationException("Either email or contact number must be provided");
            }
            // Validate password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new AuthenticationException("Incorrect password");
            }
            // Validated, generate and return JWT token with roles
            String token = jwtUtil.generateToken(email, user.getRole());
            return Map.of(
                    "email", email,
                    "token", token,
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "role", user.getRole()
                );
        } catch (Exception e) {
            throw new RuntimeException("Error validating user: " + e.getMessage());
        }
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized User updateUserDetails(String email, Map<String, String> userDetails) {
        try {
            /*
             * Only firstName, lastName, address will be updated
             * Contact number and password update will be handled separately
             * Email cannot be updated in any case
             */
            if (email != null) {
                email = email.trim();
            }
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }

            User existingUser = userRepository.findByEmail(email);
            if (existingUser == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            String firstName = userDetails.get("firstName");
            String lastName = userDetails.get("lastName");
            String address = userDetails.get("address");
            // Trim the trailing and leading spaces from all string fields
            if (firstName != null) {
                firstName = firstName.trim();
            }
            if (lastName != null) {
                lastName = lastName.trim();
            }
            if (address != null) {
                address = address.trim();
            }
            if (firstName != null && !firstName.isEmpty()) {
                existingUser.setFirstName(firstName);
            }
            if (lastName != null && !lastName.isEmpty()) {
                existingUser.setLastName(lastName);
            }
            if (address != null && !address.isEmpty()) {
                existingUser.setAddress(address);
            }
            userRepository.save(existingUser);
            return existingUser;
        } catch (Exception e) {
            throw new RuntimeException("Error updating user details: " + e.getMessage());
        }
    }

    @Override
    public boolean generateAndSendOTP(String email) {
        try {
            if (email != null)
                email = email.trim();
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            // Generate OTP - a 6 digit random number
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            // Try sending the email first, if successful then save OTP to database
            // This way, if email sending fails, OTP is not updated in database
            boolean emailSent = true;
            try {
                emailService.sendOtpEmail(email, user.getFirstName(), user.getLastName(), otp, 10);
            } catch (Exception e) {
                emailSent = false;
            }
            if (emailSent == false) {
                throw new SendFailedException("Failed to send OTP email, please try again later");
            }
            // Save OTP and expiry time to database
            user.setOtp(otp);
            user.setExpiresIn(LocalDateTime.now().plusMinutes(10)); // OTP valid for 10 minutes
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean verifyOTP(String email, String otp) {
        try {
            if (email != null)
                email = email.trim();
            if (otp != null)
                otp = otp.trim();
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (otp == null || otp.isEmpty()) {
                throw new ValidationException("OTP is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            if (user.getOtp() == null || user.getExpiresIn() == null) {
                throw new ValidationException("No OTP generated for this user");
            }
            if (LocalDateTime.now().isAfter(user.getExpiresIn())) {
                throw new ValidationException("OTP has expired, please generate a new one");
            }
            if (!user.getOtp().equals(otp)) {
                throw new ValidationException("Invalid OTP");
            }
            // OTP is valid, clear OTP and expiry time
            user.setOtp(null);
            user.setExpiresIn(null);
            userRepository.save(user);
            // OTP verified successfully
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Map<String, Object> resetPassword(String email, String newPassword) {
        try {
            if (email != null)
                email = email.trim();
            if (newPassword != null)
                newPassword = newPassword.trim();
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (newPassword == null || newPassword.isEmpty()) {
                throw new ValidationException("New password is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            if (!validation.isValidPassword(newPassword)) {
                throw new ValidationException(
                        "Invalid password format, password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            // Password should be different from the old password
            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                throw new ValidationException("New password must be different from the old password");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return Map.of(
                    "success", true,
                    "email", email,
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName());
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "message", e.getMessage());
        }
    }

    @Override
    public boolean changePassword(String email, String currentPassword, String newPassword) {
        try {
            if (email != null)
                email = email.trim();
            if (currentPassword != null)
                currentPassword = currentPassword.trim();
            if (newPassword != null)
                newPassword = newPassword.trim();
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (currentPassword == null || currentPassword.isEmpty()) {
                throw new ValidationException("Current password is required");
            }
            if (newPassword == null || newPassword.isEmpty()) {
                throw new ValidationException("New password is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            // Validate current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new AuthenticationException("Incorrect current password");
            }
            // New password should be different from the old password
            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                throw new ValidationException("New password must be different from the old password");
            }
            if (!validation.isValidPassword(newPassword)) {
                throw new ValidationException(
                        "Invalid password format, password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            try {
                userRepository.save(user);
            } catch (Exception e) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized boolean resetContactNumber(String email, String newContactNo) {
        try {
            if (email != null)
                email = email.trim();
            if (newContactNo != null)
                newContactNo = newContactNo.trim();
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (newContactNo == null || newContactNo.isEmpty()) {
                throw new ValidationException("New contact number is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            if (!validation.isValidContactNo(newContactNo)) {
                throw new ValidationException("Invalid contact number format");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            // Contact number should be different from the old contact number
            if (newContactNo.equals(user.getContactNo())) {
                throw new ValidationException("New contact number must be different from the old contact number");
            }
            // Check if new contact number already exists
            if (userRepository.existsByContactNo(newContactNo)) {
                throw new DuplicateResourceException("User with this contact number already exists");
            }

            // Update contact number
            user.setContactNo(newContactNo);
            try {
                userRepository.save(user);
            } catch (DuplicateKeyException e) {
                // Handle race condition: another thread inserted the same contact number
                throw new DuplicateResourceException("User with this contact number already exists");
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            if (email != null) {
                email = email.trim();
            }
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            // Make the password empty before returning the user object
            user.setPassword("");
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by email: " + e.getMessage());
        }
    }

    @Override
    public Map<String, List<Object>> getUserParkingHistory(String email) {
        try {
            if (email != null) {
                email = email.trim();
            }
            if (email == null || email.isEmpty()) {
                throw new ValidationException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new ValidationException("Invalid email format");
            }
            if (!userRepository.existsByEmail(email)) {
                throw new ResourceNotFoundException("User with this email does not exist");
            }
            List<ParkedTicket> parkedTickets = parkedTicketRepository.findByEmail(email);
            List<UnparkedTicket> unparkedTickets = unparkedTicketRepository.findByEmail(email);
            return Map.of(
                    "parked", List.copyOf(parkedTickets),
                    "unparked", List.copyOf(unparkedTickets));
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user parking history: " + e.getMessage());
        }
    }
}