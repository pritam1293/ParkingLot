package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.DTO.FreeRequest;
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
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ParkingService implements IParkingService {

    DisplayBoard displayBoard;
    private final ParkingSpotRepository parkingSpotRepository;
    private final ParkedTicketRepository parkedTicketRepository;
    private final UnparkedTicketRepository unparkedTicketRepository;
    private final UserRepository userRepository;
    private Map<String, String> adminCredentials;
    private final Validation validation;

    public ParkingService(ParkingSpotRepository parkingSpotRepository,
            ParkedTicketRepository parkedTicketRepository,
            UnparkedTicketRepository unparkedTicketRepository,
            UserRepository userRepository,
            Validation validation) {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingSpotRepository = parkingSpotRepository;
        this.validation = validation;
        this.adminCredentials = new HashMap<>();
        this.parkedTicketRepository = parkedTicketRepository;
        this.unparkedTicketRepository = unparkedTicketRepository;
        this.userRepository = userRepository;
        changeStatusFromDatabase();
        updateDisplayBoardFromDatabase();
        System.out.println("");
        System.out.println("MongoDB is connected");
        System.out.println("");
        updateAdminCredentials();
    }

    private void updateAdminCredentials() {
        adminCredentials.put("admin", "admin123");
        adminCredentials.put("user", "user123");
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

    private void changeStatusFromDatabase() {
        List<ParkedTicket> activeTickets = parkedTicketRepository.findAll();
        for (ParkedTicket ticket : activeTickets) {
            ParkingSpot parkingSpotFromDB = ticket.getParkingSpot();
            String occupiedType = parkingSpotFromDB.getType();
            int occupiedLocation = parkingSpotFromDB.getLocation();

            // Find and update the spot in database
            parkingSpotRepository.findByTypeAndLocation(occupiedType, occupiedLocation)
                    .ifPresent(spot -> {
                        if (!spot.isBooked()) {
                            spot.setBooked(true);
                            parkingSpotRepository.save(spot);
                        }
                    });
        }
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
            String vehicleNo = requestBody.get("vehicleNo");
            if (email != null)
                email = email.trim();
            if (type != null)
                type = type.trim();
            if (vehicleNo != null)
                vehicleNo = vehicleNo.trim();

            final String finalType = type; // Make it effectively final for lambda

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

            if (parkedTicketRepository.existsByVehicleNo(vehicleNo)) {
                throw new ParkingLotException("Vehicle with number " + vehicleNo + " is already parked.");
            }

            // Try to find and book a parking spot with retry logic for concurrency
            ParkingSpot freeParkingSpot = null;
            int maxRetries = 5;
            int attempt = 0;

            while (attempt < maxRetries && freeParkingSpot == null) {
                try {
                    // Find first available spot from database
                    freeParkingSpot = parkingSpotRepository
                            .findFirstByTypeAndIsBooked(finalType, false)
                            .orElseThrow(() -> new ParkingLotException(
                                    "No free parking spots available for type: " + finalType));

                    // Book the spot
                    freeParkingSpot.setBooked(true);
                    parkingSpotRepository.save(freeParkingSpot); // This might throw OptimisticLockingFailureException

                } catch (OptimisticLockingFailureException e) {
                    // Another user booked this spot, retry with another spot
                    freeParkingSpot = null;
                    attempt++;
                    if (attempt >= maxRetries) {
                        throw new ParkingLotException(
                                "Unable to book parking spot due to high demand. Please try again.");
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
                throw new ParkingLotException("Failed to generate unique ticket ID. Please try again.");
            }
            ParkedTicket parkedTicket = new ParkedTicket(
                    ticketId,
                    user.getFirstName(),
                    user.getLastName(),
                    email,
                    user.getContactNo(),
                    LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS),
                    vehicleNo,
                    freeParkingSpot);
            parkedTicketRepository.save(parkedTicket);
            return parkedTicket;
        } catch (Exception e) {
            throw new ParkingLotException(e.getMessage());
        }
    }

    @Override
    public FreeRequest UnparkVehicle(String ParkingTicketId) {
        try {
            if (ParkingTicketId == null || ParkingTicketId.isEmpty()) {
                throw new ParkingLotException("Ticket ID is required for unparking.");
            }
            ParkedTicket parkedTicket = parkedTicketRepository.findById(ParkingTicketId).orElse(null);
            if (parkedTicket == null) {
                throw new ParkingLotException("Invalid ticket ID or the vehicle is already unparked");
            }
            parkedTicketRepository.delete(parkedTicket);
            long totalTime = countTimeInMinutes(parkedTicket.getEntryTime());
            long totalCost = calculateCost(parkedTicket, totalTime);
            parkedTicket.getParkingSpot().setBooked(false);
            unparkedTicketRepository.save(
                    new UnparkedTicket(
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
                            parkedTicket.getParkingSpot()));

            // Free the parking spot in database
            ParkingSpot spot = parkedTicket.getParkingSpot();
            parkingSpotRepository.findByTypeAndLocation(spot.getType(), spot.getLocation())
                    .ifPresent(parkingSpot -> {
                        parkingSpot.setBooked(false);
                        parkingSpotRepository.save(parkingSpot);
                    });

            // Update display board
            updateDisplayBoardFromDatabase();

            return new FreeRequest(
                    parkedTicket.getFirstName(),
                    parkedTicket.getLastName(),
                    parkedTicket.getEmail(),
                    parkedTicket.getOwnerContact(),
                    parkedTicket.getParkingSpot().getType(),
                    parkedTicket.getVehicleNo(),
                    parkedTicket.getId(),
                    totalCost,
                    totalTime);
        } catch (Exception e) {
            throw new ParkingLotException(e.getMessage());
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
         * Generate the id till we get a unique one, max 10 attempts, else return empty string
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
    public ParkedTicket UpdateParkedVehicle(String ticketId, Map<String, String> requestBody) {
        try {
            if (ticketId == null || ticketId.isEmpty()) {
                throw new ParkingLotException("Ticket ID is required for updating parked vehicle.");
            }
            String vehicleNo = requestBody.get("vehicleNo");
            String type = requestBody.get("type");
            // Trim all the trailing and leading spaces
            if (vehicleNo != null) {
                vehicleNo = vehicleNo.trim();
            }
            if (type != null) {
                type = type.trim();
            }
            // Validate the inputs if provided
            if (vehicleNo != null && !vehicleNo.isEmpty()) {
                if (!validation.isVehicleNoValid(vehicleNo)) {
                    throw new ParkingLotException("Invalid vehicle number format.");
                }
            }
            if (type != null && !type.isEmpty()) {
                if (!validation.isValidVehicleType(type)) {
                    throw new ParkingLotException("Invalid vehicle type. Allowed types are: mini, large, compact.");
                }
            }
            ParkedTicket ticket = parkedTicketRepository.findById(ticketId).orElse(null);
            if (ticket == null) {
                throw new ParkingLotException("Invalid ticket ID or the vehicle is already unparked.");
            }
            if (vehicleNo != null && !vehicleNo.isEmpty()) {
                if (parkedTicketRepository.existsByVehicleNo(vehicleNo)) {
                    throw new ParkingLotException("Vehicle with number " + vehicleNo + " is already parked.");
                }
                ticket.setVehicleNo(vehicleNo);
            }
            if (type != null && !type.isEmpty() && !type.equals(ticket.getParkingSpot().getType())) {
                ticket.getParkingSpot().setType(type);
                ticket.getParkingSpot().setCost(validation.getCostByVehicleType(type));
                // Assign a new parking spot for the new type and free the assigned spot in DB
                ParkingSpot currentSpot = ticket.getParkingSpot();
                parkingSpotRepository.findByTypeAndLocation(currentSpot.getType(), currentSpot.getLocation())
                        .ifPresent(spot -> {
                            spot.setBooked(false);
                            parkingSpotRepository.save(spot);
                        });
                final String newType = type; // for lambda
                ParkingSpot newSpot = parkingSpotRepository
                        .findFirstByTypeAndIsBooked(newType, false)
                        .orElseThrow(() -> new ParkingLotException(
                                "No free parking spots available for type: " + newType));
                newSpot.setBooked(true);
                parkingSpotRepository.save(newSpot);
                ticket.setParkingSpot(newSpot);
                // Update display board
                updateDisplayBoardFromDatabase();
            }
            parkedTicketRepository.save(ticket);
            return ticket;
        } catch (Exception e) {
            throw new ParkingLotException(e.getMessage());
        }
    }

    @Override
    public boolean validateAdminCredentials(String username, String password) {
        return adminCredentials.containsKey(username) && adminCredentials.get(username).equals(password);
    }

    @Override
    public List<ParkedTicket> getActiveParkedVehicles() {
        // Return only currently parked vehicles (not completed)
        return parkedTicketRepository.findAll();
    }

    @Override
    public List<UnparkedTicket> getCompletedParkedVehicles() {
        // Return only completed vehicles
        return unparkedTicketRepository.findAll();
    }

    @Override
    public long countCompletedVehiclesToday() {
        LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        List<UnparkedTicket> completedTickets = unparkedTicketRepository.findByExitTime(today);
        return completedTickets.size();
    }

    @Override
    public long countRevenueToday() {
        try {
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            List<UnparkedTicket> completedTickets = unparkedTicketRepository.findByExitTime(today);
            long totalRevenue = 0;
            for (UnparkedTicket ticket : completedTickets) {
                totalRevenue += ticket.getTotalCost();
            }
            return totalRevenue;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public long countRevenueThisWeek() {
        try {
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            LocalDateTime startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1); // Monday is the start of
                                                                                              // the week
            List<UnparkedTicket> completedTickets = unparkedTicketRepository.findByExitTimeBetween(startOfWeek, today);
            long totalRevenue = 0;
            for (UnparkedTicket ticket : completedTickets) {
                if (ticket.getExitTime() != null && !ticket.getExitTime().isBefore(startOfWeek)
                        && !ticket.getExitTime().isAfter(today)) {
                    totalRevenue += ticket.getTotalCost();
                }
            }
            return totalRevenue;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public long countRevenueThisMonth() {
        try {
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            LocalDateTime startOfMonth = today.withDayOfMonth(1);
            List<UnparkedTicket> completedTickets = unparkedTicketRepository.findByExitTimeBetween(startOfMonth, today);
            long totalRevenue = 0;
            for (UnparkedTicket ticket : completedTickets) {
                if (ticket.getExitTime() != null && !ticket.getExitTime().isBefore(startOfMonth)
                        && !ticket.getExitTime().isAfter(today)) {
                    totalRevenue += ticket.getTotalCost();
                }
            }
            return totalRevenue;
        } catch (Exception e) {
            return 0;
        }
    }
}