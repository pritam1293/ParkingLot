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
    public synchronized String registerUser(User user) {
        try {
            // Trim the trailing and leading spaces from all string fields
            if (user.getFirstName() != null) {
                user.setFirstName(user.getFirstName().trim());
            }
            if (user.getLastName() != null) {
                user.setLastName(user.getLastName().trim());
            }
            if (user.getEmail() != null) {
                user.setEmail(user.getEmail().trim());
            }
            if (user.getContactNo() != null) {
                user.setContactNo(user.getContactNo().trim());
            }
            if (user.getPassword() != null) {
                user.setPassword(user.getPassword().trim());
            }
            // User object validation
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            if (user.getContactNo() == null || user.getContactNo().isEmpty()) {
                throw new RuntimeException("Contact number is required");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                throw new RuntimeException("Password is required");
            }
            // Validate email and contact number formats
            if (!validation.isValidEmail(user.getEmail())) {
                throw new RuntimeException("Invalid email format");
            }
            if (!validation.isValidContactNo(user.getContactNo())) {
                throw new RuntimeException("Invalid contact number format");
            }
            if (!validation.isValidPassword(user.getPassword())) {
                throw new RuntimeException("Invalid password format");
            }
            if (user.getFirstName() == null) {
                user.setFirstName(user.getEmail());
            }
            if (user.getLastName() == null) {
                user.setLastName("");
            }
            if (userRepository.findByEmail(user.getEmail()) != null) {
                throw new RuntimeException("User with this email already exists");
            }
            if (userRepository.findByContactNo(user.getContactNo()) != null) {
                throw new RuntimeException("User with this contact number already exists");
            }
            user.setCreatedAt(LocalDate.now());
            // Encode the password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            // Generate and return JWT token
            String token = jwtUtil.generateToken(user.getEmail());
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Error registering user: " + e.getMessage());
        }
    }

    @Override
    public String validateUser(String email, String contactNo, String password) {
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
            if(password == null || password.isEmpty()) {
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
            // Validated, generate and return JWT token
            String token = jwtUtil.generateToken(user.getEmail());
            return token;
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
                "unparked", List.copyOf(unparkedTickets)
            );
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user parking history: " + e.getMessage());
        }
    }
}