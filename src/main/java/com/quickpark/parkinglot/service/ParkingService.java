package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.DisplayBoard;
import com.quickpark.parkinglot.entities.ParkingLot;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.Exceptions.ParkingLotException;

import com.quickpark.parkinglot.repository.ParkedTicketRepository;
import com.quickpark.parkinglot.repository.UnparkedTicketRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ParkingService implements IParkingService {

    DisplayBoard displayBoard;
    ParkingLot parkingLot;

    private final ParkedTicketRepository parkedTicketRepository;
    private final UnparkedTicketRepository unparkedTicketRepository;
    private Map<String, String> adminCredentials;

    public ParkingService(ParkedTicketRepository parkedTicketRepository,
            UnparkedTicketRepository unparkedTicketRepository) {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingLot = new ParkingLot();
        this.adminCredentials = new HashMap<>();
        this.parkedTicketRepository = parkedTicketRepository;
        this.unparkedTicketRepository = unparkedTicketRepository;
        changeStatusFromDatabase();
        System.out.println("");
        System.out.println("MongoDB is connected");
        System.out.println("");
        updateAdminCredentials();
    }

    private void updateAdminCredentials() {
        adminCredentials.put("admin", "admin123");
        adminCredentials.put("user", "user123");
    }

    private void changeStatusFromDatabase() {
        List<ParkedTicket> activeTickets = parkedTicketRepository.findAll();
        for (ParkedTicket ticket : activeTickets) {
            ParkingSpot parkingSpotFromDB = ticket.getParkingSpot();
            String occupiedType = parkingSpotFromDB.getType();
            int occupiedLocation = parkingSpotFromDB.getLocation();

            for (ParkingSpot parkingSpot : parkingLot.getParkingSpotList()) {
                if (parkingSpot.getType().equals(occupiedType) && parkingSpot.getLocation() == occupiedLocation) {
                    parkingSpot.setBooked(true);
                    displayBoard.changeFreeParkingSpot(parkingSpot);
                    break;
                }
            }
        }
    }

    @Override
    public DisplayResponse getFreeParkingSpots() {
        DisplayResponse displayResponse = new DisplayResponse();
        displayResponse.mini = displayBoard.getFreeMiniParkingSpots();
        displayResponse.large = displayBoard.getFreeLargeParkingSpots();
        displayResponse.compact = displayBoard.getFreeCompactParkingSpots();
        return displayResponse;
    }

    @Override
    public ParkedTicket ParkVehicle(BookRequest bookRequest) {
        try {
            if (parkedTicketRepository.existsByVehicleNo(bookRequest.getVehicleNo())) {
                throw new ParkingLotException("Vehicle with number " + bookRequest.getVehicleNo() + " is already parked.");
            }
            ParkingSpot freeParkingSpot = null;
            for (ParkingSpot parkingSpot : parkingLot.getParkingSpotList()) {
                if (bookRequest.getType().equals(parkingSpot.getType()) && !parkingSpot.isBooked()) {
                    freeParkingSpot = parkingSpot;
                    parkingSpot.setBooked(true);
                    break;
                }
            }
            if (freeParkingSpot == null) {
                throw new ParkingLotException("No free parking spots available for type: " + bookRequest.getType());
            }
            displayBoard.changeFreeParkingSpot(freeParkingSpot);
            String id = generateRandomId();
            ParkedTicket parkedTicket = new ParkedTicket(
                    id,
                    bookRequest.getOwnerName(),
                    bookRequest.getOwnerContact(),
                    LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS),
                    bookRequest.getVehicleNo(),
                    freeParkingSpot
            );
            parkedTicketRepository.save(parkedTicket);
            return parkedTicket;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public FreeRequest UnparkVehicle(String ParkingTicketId) {
        try {
            ParkedTicket parkedTicket = parkedTicketRepository.findById(ParkingTicketId).orElse(null);
            if (parkedTicket == null) {
                throw new ParkingLotException("Invalid ticket ID or the vehicle is already unparked");
            }
            parkedTicketRepository.delete(parkedTicket);
            long totalTime = countTimeInMinutes(parkedTicket.getEntryTime());
            long totalCost = calculateCost(parkedTicket, totalTime);
            unparkedTicketRepository.save(
                    new UnparkedTicket(
                            parkedTicket.getId(),
                            parkedTicket.getOwnerName(),
                            parkedTicket.getOwnerContact(),
                            parkedTicket.getEntryTime(),
                            LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS),
                            totalTime,
                            totalCost,
                            parkedTicket.getVehicleNo(),
                            parkedTicket.getParkingSpot())
            );
            parkedTicket.getParkingSpot().setBooked(false);
            displayBoard.changeFreeParkingSpot(parkedTicket.getParkingSpot());
            return new FreeRequest(
                    parkedTicket.getOwnerName(),
                    parkedTicket.getOwnerContact(),
                    parkedTicket.getParkingSpot().getType(),
                    parkedTicket.getVehicleNo(),
                    parkedTicket.getId(),
                    totalCost,
                    totalTime
            );
        } catch (Exception e) {
            return null;
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
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    @Override
    public ParkedTicket UpdateParkedVehicle(String ticketId, BookRequest bookRequest) {
        try {
            ParkedTicket ticket = parkedTicketRepository.findById(ticketId).orElse(null);
            if (ticket == null) {
                throw new ParkingLotException("Invalid ticket ID");
            }
            ticket.setVehicleNo(bookRequest.getVehicleNo());
            ticket.setOwnerName(bookRequest.getOwnerName());
            ticket.setOwnerContact(bookRequest.getOwnerContact());
            parkedTicketRepository.save(ticket);
            return ticket;
        } catch (Exception e) {
            return null;
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
            LocalDateTime startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1); // Monday is the start of the week
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