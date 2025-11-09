package com.quickpark.parkinglot.service;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;
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

@Service
public class UserService implements IUserService {

    private PasswordEncoder passwordEncoder;
    private JWT jwtUtil;
    private final UserRepository userRepository;
    private final Validation validation;
    private final ParkedTicketRepository parkedTicketRepository;
    private final UnparkedTicketRepository unparkedTicketRepository;

    public UserService(PasswordEncoder passwordEncoder, JWT jwtUtil,
            UserRepository userRepository, Validation validation,
            ParkedTicketRepository parkedTicketRepository,
            UnparkedTicketRepository unparkedTicketRepository) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.parkedTicketRepository = parkedTicketRepository;
        this.unparkedTicketRepository = unparkedTicketRepository;
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
            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            if (validation.isValidEmail(email) == false) {
                throw new RuntimeException("Invalid email format");
            }
            if (contactNo == null || contactNo.isEmpty()) {
                throw new RuntimeException("Contact number is required");
            }
            if (validation.isValidContactNo(contactNo) == false) {
                throw new RuntimeException("Invalid contact number format");
            }
            if (password == null || password.isEmpty()) {
                throw new RuntimeException("Password is required");
            }
            if (validation.isValidPassword(password) == false) {
                throw new RuntimeException("Invalid password format, password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            }
            if (secretKey != null && !secretKey.isEmpty()) {
                /*
                 * If secret key is provided, check if it is valid for admin user creation
                 * The provided secret key should also contain extra characters to avoid easy guessing
                 * So the actual admin secret key is subsequence of the provided secret key
                 * The length of the provided secret key should be between 40 to 60 characters
                */
                if (!validation.isAdminSecretKeyValid(secretKey)) {
                    throw new RuntimeException("Invalid admin secret key");
                }
                role = "ADMIN"; // Promote to ADMIN role
            }
            // Check if user with same email or contact number already exists
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("User with this email already exists");
            }
            if (userRepository.existsByContactNo(contactNo)) {
                throw new RuntimeException("User with this contact number already exists");
            }
            if (firstName == null || firstName.isEmpty()) {
                firstName = email.substring(0, email.indexOf('@'));
            }
            if (lastName == null) {
                lastName = "";
            }
            if (address == null) {
                address = "";
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
                    LocalDate.now());

            userRepository.save(newUser);
            // Generate JWT token with roles
            String token = jwtUtil.generateToken(email, role);
            return Map.of(
                    "email", email,
                    "token", token,
                    "firstName", newUser.getFirstName(),
                    "lastName", newUser.getLastName());
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
                throw new RuntimeException("Password is required");
            }
            User user = null;

            // If email is provided, validate using email
            if (email != null && !email.isEmpty()) {
                if (!validation.isValidEmail(email)) {
                    throw new RuntimeException("Invalid email format");
                }
                user = userRepository.findByEmail(email);
                if (user == null) {
                    throw new RuntimeException("User with this email does not exist");
                }
            }
            // If contact number is provided, validate using contact number
            else if (contactNo != null && !contactNo.isEmpty()) {
                if (!validation.isValidContactNo(contactNo)) {
                    throw new RuntimeException("Invalid contact number format");
                }
                user = userRepository.findByContactNo(contactNo);
                if (user == null) {
                    throw new RuntimeException("User with this contact number does not exist");
                }
            } else {
                throw new RuntimeException("Either email or contact number must be provided");
            }
            // Validate password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("Incorrect password");
            }
            // Validated, generate and return JWT token with roles
            String token = jwtUtil.generateToken(email, user.getRole());
            return Map.of(
                    "email", email,
                    "token", token,
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName());
        } catch (Exception e) {
            throw new RuntimeException("Error validating user: " + e.getMessage());
        }
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized String updateUserDetails(String email, User user) {
        try {
            if (email != null) {
                email = email.trim();
            }
            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new RuntimeException("Invalid email format");
            }
            User existingUser = userRepository.findByEmail(email);
            if (existingUser == null) {
                throw new RuntimeException("User with this email does not exist");
            }
            // Update fields if they are provided
            if (user.getFirstName() != null) {
                user.setFirstName(user.getFirstName().trim());
                if (!user.getFirstName().isEmpty()) {
                    existingUser.setFirstName(user.getFirstName());
                }
            }
            if (user.getLastName() != null) {
                user.setLastName(user.getLastName().trim());
                if (!user.getLastName().isEmpty()) {
                    existingUser.setLastName(user.getLastName());
                }
            }
            if (user.getEmail() != null) {
                user.setEmail(user.getEmail().trim());
                if (user.getEmail().isEmpty()) {
                    throw new RuntimeException("Email cannot be empty");
                }
                if (!validation.isValidEmail(user.getEmail())) {
                    throw new RuntimeException("Invalid email format");
                }
                if (!user.getEmail().equals(email) && userRepository.existsByEmail(user.getEmail())) {
                    throw new RuntimeException("Another user with this email already exists");
                }
                existingUser.setEmail(user.getEmail());
            }
            if (user.getContactNo() != null) {
                user.setContactNo(user.getContactNo().trim());
                if (user.getContactNo().isEmpty()) {
                    throw new RuntimeException("Contact number cannot be empty");
                }
                if (!validation.isValidContactNo(user.getContactNo())) {
                    throw new RuntimeException("Invalid contact number format");
                }
                if (!user.getContactNo().equals(existingUser.getContactNo()) &&
                        userRepository.existsByContactNo(user.getContactNo())) {
                    throw new RuntimeException("Another user with this contact number already exists");
                }
                existingUser.setContactNo(user.getContactNo());
            }
            if (user.getPassword() != null) {
                user.setPassword(user.getPassword().trim());
                if (user.getPassword().isEmpty()) {
                    throw new RuntimeException("Password cannot be empty");
                }
                if (!validation.isValidPassword(user.getPassword())) {
                    throw new RuntimeException("Invalid password format");
                }
                // Current password and new password should not be the same
                if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                    throw new RuntimeException("New password cannot be the same as the current password");
                }
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            userRepository.save(existingUser);
            return "User details updated successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error updating user details: " + e.getMessage());
        }
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            if (email != null) {
                email = email.trim();
            }
            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new RuntimeException("Invalid email format");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User with this email does not exist");
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
                throw new RuntimeException("Email is required");
            }
            if (!validation.isValidEmail(email)) {
                throw new RuntimeException("Invalid email format");
            }
            if (!userRepository.existsByEmail(email)) {
                throw new RuntimeException("User with this email does not exist");
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