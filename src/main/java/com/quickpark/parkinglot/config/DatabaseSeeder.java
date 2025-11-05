package com.quickpark.parkinglot.config;

import com.quickpark.parkinglot.entities.CompactParkingSpot;
import com.quickpark.parkinglot.entities.LargeParkingSpot;
import com.quickpark.parkinglot.entities.MiniParkingSpot;
import com.quickpark.parkinglot.entities.User;
import com.quickpark.parkinglot.repository.ParkingSpotRepository;
import com.quickpark.parkinglot.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ParkingSpotRepository parkingSpotRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(ParkingSpotRepository parkingSpotRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.parkingSpotRepository = parkingSpotRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedParkingSpots();
        seedAdminUser();
    }

    private void seedParkingSpots() {
        // Check if parking spots already exist in database
        if (parkingSpotRepository.count() == 0) {
            System.out.println("========================================");
            System.out.println("Database is empty. Seeding parking spots...");
            System.out.println("========================================");

            // Create 50 mini parking spots (locations 1-50)
            for (int i = 1; i <= 50; i++) {
                parkingSpotRepository.save(new MiniParkingSpot(i));
            }

            // Create 75 compact parking spots (locations 51-125)
            for (int i = 51; i <= 125; i++) {
                parkingSpotRepository.save(new CompactParkingSpot(i));
            }

            // Create 25 large parking spots (locations 126-150)
            for (int i = 126; i <= 150; i++) {
                parkingSpotRepository.save(new LargeParkingSpot(i));
            }

            System.out.println("Seeded 50 Mini parking spots (Locations: 1-50, Cost: ₹20/hour)");
            System.out.println("Seeded 75 Compact parking spots (Locations: 51-125, Cost: ₹35/hour)");
            System.out.println("Seeded 25 Large parking spots (Locations: 126-150, Cost: ₹50/hour)");
            System.out.println("========================================");
            System.out.println("Total parking spots seeded: 150");
            System.out.println("========================================");
        } else {
            System.out.println("========================================");
            System.out.println("Parking spots already exist in database.");
            System.out.println("Total spots: " + parkingSpotRepository.count());
            System.out.println("Available spots: " + parkingSpotRepository.countByIsBooked(false));
            System.out.println("Occupied spots: " + parkingSpotRepository.countByIsBooked(true));
            System.out.println("========================================");
        }
    }

    private void seedAdminUser() {
        // Check if admin user already exists
        User existingAdmin = userRepository.findByEmail("admin@quickpark.com");

        if (existingAdmin == null) {
            System.out.println("========================================");
            System.out.println("Creating default admin user...");
            System.out.println("========================================");

            User adminUser = new User();
            adminUser.setEmail("admin@quickpark.com");
            adminUser.setContactNo("9999999999");
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setPassword(passwordEncoder.encode("Admin@123"));
            adminUser.setCreatedAt(LocalDate.now());
            adminUser.addRole("ADMIN");

            userRepository.save(adminUser);

            System.out.println("Default admin user created successfully!");
            System.out.println("Email: admin@quickpark.com");
            System.out.println("Password: Admin@123");
            System.out.println("========================================");
            System.out.println("⚠️  IMPORTANT: Change the admin password after first login!");
            System.out.println("========================================");
        } else {
            System.out.println("========================================");
            System.out.println("Admin user already exists.");
            System.out.println("Email: " + existingAdmin.getEmail());
            System.out.println("========================================");
        }
    }
}