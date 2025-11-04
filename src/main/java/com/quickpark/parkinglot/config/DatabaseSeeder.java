package com.quickpark.parkinglot.config;

import com.quickpark.parkinglot.entities.CompactParkingSpot;
import com.quickpark.parkinglot.entities.LargeParkingSpot;
import com.quickpark.parkinglot.entities.MiniParkingSpot;
import com.quickpark.parkinglot.repository.ParkingSpotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ParkingSpotRepository parkingSpotRepository;

    public DatabaseSeeder(ParkingSpotRepository parkingSpotRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
    }

    @Override
    public void run(String... args) throws Exception {
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
}
