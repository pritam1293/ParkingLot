package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.entities.DisplayBoard;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.Exceptions.ParkingLotException;

import com.quickpark.parkinglot.repository.ParkedTicketRepository;
import com.quickpark.parkinglot.repository.UnparkedTicketRepository;
import com.quickpark.parkinglot.repository.UserRepository;
import com.quickpark.parkinglot.repository.ParkingSpotRepository;
import com.quickpark.parkinglot.entities.User;
import org.springframework.stereotype.Service;
import org.springframework.dao.OptimisticLockingFailureException;

import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ParkingService implements IParkingService {

    DisplayBoard displayBoard;
    private final ParkingSpotRepository parkingSpotRepository;
    private final ParkedTicketRepository parkedTicketRepository;
    private final UnparkedTicketRepository unparkedTicketRepository;
    private final UserRepository userRepository;
    private final Validation validation;

    public ParkingService(ParkingSpotRepository parkingSpotRepository, ParkedTicketRepository parkedTicketRepository,
            UnparkedTicketRepository unparkedTicketRepository, UserRepository userRepository, Validation validation) {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingSpotRepository = parkingSpotRepository;
        this.validation = validation;
        this.parkedTicketRepository = parkedTicketRepository;
        this.unparkedTicketRepository = unparkedTicketRepository;
        this.userRepository = userRepository;
        updateDisplayBoardFromDatabase();
        System.out.println("");
        System.out.println("MongoDB is connected");
        System.out.println("");
    }

    private void updateDisplayBoardFromDatabase() {
        // Update display board with counts from database
        long freeMini = parkingSpotRepository.countByTypeAndIsBooked("mini", false);
        long freeCompact = parkingSpotRepository.countByTypeAndIsBooked("compact", false);
        long freeLarge = parkingSpotRepository.countByTypeAndIsBooked("large", false);

        displayBoard.setFreeMiniParkingSpots((int) freeMini);
        displayBoard.setFreeCompactParkingSpots((int) freeCompact);
        displayBoard.setFreeLargeParkingSpots((int) freeLarge);
    }

    @Override
    public DisplayResponse getFreeParkingSpots() {
        DisplayResponse displayResponse = new DisplayResponse();
        displayResponse.mini = (int) parkingSpotRepository.countByTypeAndIsBooked("mini", false);
        displayResponse.large = (int) parkingSpotRepository.countByTypeAndIsBooked("large", false);
        displayResponse.compact = (int) parkingSpotRepository.countByTypeAndIsBooked("compact", false);
        return displayResponse;
    }

    @Override
    public ParkedTicket ParkVehicle(Map<String, String> requestBody) {
        try {
            // Trim all the trailing and leading spaces
            String email = requestBody.get("email");
            String type = requestBody.get("type");
            String vehicleModel = requestBody.get("vehicleModel");
            String vehicleNo = requestBody.get("vehicleNo");
            if (email != null) {
                email = email.trim();
            }
            if (type != null) {
                type = type.trim();
            }
            if (vehicleNo != null) {
                vehicleNo = vehicleNo.trim();
            }
            if (vehicleModel != null) {
                vehicleModel = vehicleModel.trim();
            }
            final String finalType = type; // Make it effectively final for lambda
            if (vehicleModel == null) {
                // Based on type set it as default model name
                vehicleModel = getDefaultVehicleModel(finalType);
            }
            if (email == null || email.isEmpty()) {
                throw new ParkingLotException("Email is required for parking.");
            }
            // vehicle should oneof type mini, large, compact
            if (finalType == null || finalType.isEmpty()) {
                throw new ParkingLotException("Vehicle type is required for parking.");
            }
            if (!validation.isValidVehicleType(finalType)) {
                throw new ParkingLotException("Invalid vehicle type. Allowed types are: mini, large, compact.");
            }
            if (vehicleNo == null || vehicleNo.isEmpty()) {
                throw new ParkingLotException("Vehicle number is required for parking.");
            }
            if (!validation.isVehicleNoValid(vehicleNo)) {
                throw new ParkingLotException("Invalid vehicle number format.");
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new ParkingLotException("User with email " + email + " does not exist.");
            }

            // Try to find and book a parking spot with retry logic for concurrency
            ParkingSpot freeParkingSpot = null;
            int maxRetries = 5;
            int attempt = 0;

            while (attempt < maxRetries && freeParkingSpot == null) {
                try {
                    // Check if vehicle is already parked (inside retry loop to avoid race
                    // condition)
                    if (parkedTicketRepository.existsByVehicleNo(vehicleNo)) {
                        throw new ParkingLotException("Vehicle with number " + vehicleNo + " is already parked.");
                    }

                    // Find first available spot from database
                    freeParkingSpot = parkingSpotRepository
                            .findFirstByTypeAndIsBooked(finalType, false)
                            .orElseThrow(() -> new ParkingLotException(
                                    "No free parking spots available for type: " + finalType));

                    // Book the spot
                    freeParkingSpot.setBooked(true);
                    freeParkingSpot.setUpdatedAt(LocalDateTime.now());
                    parkingSpotRepository.save(freeParkingSpot); // This might throw OptimisticLockingFailureException

                } catch (OptimisticLockingFailureException e) {
                    // Another user booked this spot, retry with another spot
                    freeParkingSpot = null;
                    attempt++;
                    if (attempt >= maxRetries) {
                        throw new ParkingLotException(
                                "Unable to book parking spot due to high demand. Please try again.");
                    }
                    // Small delay before retry to reduce contention
                    try {
                        Thread.sleep(50);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new ParkingLotException("Parking operation was interrupted. Please try again.");
                    }
                }
            }

            if (freeParkingSpot == null) {
                throw new ParkingLotException("No free parking spots available for type: " + finalType);
            }

            // Update display board
            updateDisplayBoardFromDatabase();

            String ticketId = generateRandomId();
            if (ticketId.isEmpty()) {
                // Rollback: Free the spot again
                try {
                    freeParkingSpot.setBooked(false);
                    freeParkingSpot.setUpdatedAt(LocalDateTime.now());
                    parkingSpotRepository.save(freeParkingSpot);
                    updateDisplayBoardFromDatabase();
                } catch (OptimisticLockingFailureException e) {
                    // If rollback fails due to version mismatch, the spot might already be freed or rebooked
                    // Log this but don't throw - the original error is more important
                    System.err.println("Warning: Failed to rollback parking spot booking: " + e.getMessage());
                }
                throw new ParkingLotException("Failed to generate unique ticket ID. Please try again.");
            }

            // Create and save the parked ticket
            ParkedTicket parkedTicket = new ParkedTicket(
                    ticketId,
                    user.getFirstName(),
                    user.getLastName(),
                    email,
                    user.getContactNo(),
                    LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS),
                    vehicleNo,
                    vehicleModel,
                    freeParkingSpot);

            try {
                parkedTicketRepository.save(parkedTicket);
            } catch (Exception e) {
                // Rollback: Free the parking spot if ticket creation fails
                try {
                    freeParkingSpot.setBooked(false);
                    freeParkingSpot.setUpdatedAt(LocalDateTime.now());
                    parkingSpotRepository.save(freeParkingSpot);
                    updateDisplayBoardFromDatabase();
                } catch (OptimisticLockingFailureException ole) {
                    System.err.println(
                            "Warning: Failed to rollback parking spot after ticket save failure: " + ole.getMessage());
                }
                throw new ParkingLotException("Failed to create parking ticket: " + e.getMessage());
            }

            return parkedTicket;
        } catch (ParkingLotException e) {
            throw e;
        } catch (Exception e) {
            throw new ParkingLotException("Unexpected error during parking: " + e.getMessage());
        }
    }

    private String getDefaultVehicleModel(String vehicleType) {
        switch (vehicleType) {
            case "mini":
                return "Mini Model X";
            case "compact":
                return "Compact Model Y";
            case "large":
                return "Large Model Z";
            default:
                return "Unknown Model";
        }
    }

    @Override
    public UnparkedTicket UnparkVehicle(String ParkingTicketId, String userEmail) {
        try {
            if (ParkingTicketId != null) {
                ParkingTicketId = ParkingTicketId.trim();
            }
            if (ParkingTicketId == null || ParkingTicketId.isEmpty()) {
                throw new ParkingLotException("Ticket ID is required for unparking.");
            }

            // Fetch the parked ticket
            ParkedTicket parkedTicket = parkedTicketRepository.findById(ParkingTicketId).orElse(null);
            if (parkedTicket == null) {
                throw new ParkingLotException("Invalid ticket ID or the vehicle is already unparked");
            }

            // Authorization check
            if (!parkedTicket.getEmail().equals(userEmail)) {
                throw new ParkingLotException("Unauthorized unparking attempt for ticket ID: " + ParkingTicketId);
            }

            // Calculate time and cost
            long totalTime = countTimeInMinutes(parkedTicket.getEntryTime());
            long totalCost = calculateCost(parkedTicket, totalTime);

            // Get the parking spot location before deletion
            String parkingSpotLocation = parkedTicket.getParkingSpot().getLocation();

            // Create unparked ticket with embedded parking spot info
            UnparkedTicket unparkedTicket = new UnparkedTicket(
                    parkedTicket.getId(),
                    parkedTicket.getFirstName(),
                    parkedTicket.getLastName(),
                    parkedTicket.getEmail(),
                    parkedTicket.getOwnerContact(),
                    parkedTicket.getEntryTime(),
                    LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS),
                    totalTime,
                    totalCost,
                    parkedTicket.getVehicleNo(),
                    parkedTicket.getVehicleModel(),
                    parkedTicket.getParkingSpot());

            // Unpark with retry logic for race condition handling
            int maxRetries = 5;
            int attempt = 0;
            boolean success = false;

            while (attempt < maxRetries && !success) {
                try {
                    // Step 1: Save unparked ticket first (to ensure history is captured)
                    unparkedTicketRepository.save(unparkedTicket);

                    // Step 2: Delete parked ticket
                    parkedTicketRepository.delete(parkedTicket);

                    // Step 3: Free the parking spot in database with optimistic locking
                    ParkingSpot parkingSpot = parkingSpotRepository.findByLocation(parkingSpotLocation);
                    if (parkingSpot == null) {
                        throw new ParkingLotException("Parking spot not found: " + parkingSpotLocation);
                    }
                    parkingSpot.setBooked(false);
                    parkingSpot.setUpdatedAt(LocalDateTime.now());
                    parkingSpotRepository.save(parkingSpot); // May throw OptimisticLockingFailureException

                    success = true;

                } catch (OptimisticLockingFailureException e) {
                    // Concurrent modification on parking spot, retry
                    attempt++;
                    if (attempt >= maxRetries) {
                        // Rollback: Try to restore parked ticket and delete unparked ticket
                        try {
                            unparkedTicketRepository.delete(unparkedTicket);
                            parkedTicketRepository.save(parkedTicket);
                        } catch (Exception rollbackException) {
                            System.err.println(
                                    "CRITICAL: Failed to rollback unpark operation for ticket " + ParkingTicketId
                                            + ": " + rollbackException.getMessage());
                        }
                        throw new ParkingLotException(
                                "Unable to complete unpark operation due to high system load. Please try again.");
                    }

                    // Small delay before retry
                    try {
                        Thread.sleep(50);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new ParkingLotException("Unpark operation was interrupted. Please try again.");
                    }

                } catch (Exception e) {
                    // Other exception occurred, try to rollback
                    try {
                        unparkedTicketRepository.delete(unparkedTicket);
                        // Don't restore parked ticket if it was already deleted
                        if (!parkedTicketRepository.existsById(ParkingTicketId)) {
                            parkedTicketRepository.save(parkedTicket);
                        }
                    } catch (Exception rollbackException) {
                        System.err.println("CRITICAL: Failed to rollback unpark operation for ticket " + ParkingTicketId
                                + ": " + rollbackException.getMessage());
                    }
                    throw new ParkingLotException("Error occurred while unparking vehicle: " + e.getMessage());
                }
            }

            if (!success) {
                throw new ParkingLotException("Failed to complete unpark operation after multiple attempts.");
            }

            // Update display board
            updateDisplayBoardFromDatabase();

            return unparkedTicket;

        } catch (ParkingLotException e) {
            throw e;
        } catch (Exception e) {
            throw new ParkingLotException("Unexpected error occurred while unparking vehicle: " + e.getMessage());
        }
    }

    private long countTimeInMinutes(LocalDateTime entryTime) {
        LocalDateTime exitTime = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        return ChronoUnit.MINUTES.between(entryTime, exitTime);
    }

    private long calculateCost(ParkedTicket parkedTicket, long totalTime) {
        totalTime = Math.max(0, totalTime - 30); // first 30 minutes are free
        double totalTimeinHours = totalTime / 60.0; // Convert to hours
        double totalCost = totalTimeinHours * parkedTicket.getParkingSpot().getCost();
        return (long) totalCost;
    }

    private String generateRandomId() {
        /*
         * Generate a random 8-character alphanumeric ID, starting with QP
         * Generate the id till we get a unique one, max 10 attempts, else return empty
         * string
         */
        String randomId = "QP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        int attempts = 0;
        while (parkedTicketRepository.existsById(randomId) && attempts < 10) {
            randomId = "QP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
            attempts++;
        }
        return attempts < 10 ? randomId : ""; // return empty string if unique ID not found
    }

    @Override
    public ParkedTicket UpdateParkedVehicle(String ticketId, String vehicleNo) {
        try {
            if (ticketId != null) {
                ticketId = ticketId.trim();
            }
            if (vehicleNo != null) {
                vehicleNo = vehicleNo.trim();
            }
            if (ticketId == null || ticketId.isEmpty()) {
                throw new ParkingLotException("Ticket ID is required for updating parked vehicle.");
            }
            if (vehicleNo == null || vehicleNo.isEmpty()) {
                throw new ParkingLotException("Vehicle number is required for updating parked vehicle.");
            }
            if (!validation.isVehicleNoValid(vehicleNo)) {
                throw new ParkingLotException("Invalid vehicle number format.");
            }
            ParkedTicket parkedTicket = parkedTicketRepository.findById(ticketId).orElse(null);
            if (parkedTicket == null) {
                throw new ParkingLotException("Invalid ticket ID or the vehicle is already unparked");
            }
            parkedTicket.setVehicleNo(vehicleNo);
            parkedTicketRepository.save(parkedTicket);
            return parkedTicket;
        } catch (Exception e) {
            throw new ParkingLotException(e.getMessage());
        }
    }
}