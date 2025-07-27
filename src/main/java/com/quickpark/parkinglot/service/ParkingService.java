package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.DisplayBoard;
import com.quickpark.parkinglot.entities.ParkingLot;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;

//mongodb imports
import com.quickpark.parkinglot.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.UUID;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class ParkingService implements IParkingService{

    DisplayBoard displayBoard;
    ParkingLot parkingLot;

    private final TicketRepository ticketRepository;
    // private Map<String, Ticket> ticketMap;// Key = ticketId, Value = Ticket object

    public ParkingService(TicketRepository ticketRepository) {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingLot = new ParkingLot();
        // this.ticketMap = new HashMap<>();
        this.ticketRepository = ticketRepository;
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
    public Ticket ParkVehicle(BookRequest bookRequest) {
        if (bookRequest == null || bookRequest.getType() == null || bookRequest.getVehicleNo() == null || bookRequest.getType().isEmpty() || bookRequest.getVehicleNo().isEmpty() || bookRequest.getOwnerName() == null || bookRequest.getOwnerContact() == null || bookRequest.getOwnerName().isEmpty() || bookRequest.getOwnerContact().isEmpty()) {
            return null;
        }

        //make sure that the variables are not leading or trailing with spaces and also no extra spaces in between
        bookRequest.setType(bookRequest.getType().trim().replaceAll("\\s+", " "));
        bookRequest.setVehicleNo(bookRequest.getVehicleNo().trim().replaceAll("\\s+", " "));
        bookRequest.setOwnerName(bookRequest.getOwnerName().trim().replaceAll("\\s+", " "));
        bookRequest.setOwnerContact(bookRequest.getOwnerContact().trim().replaceAll("\\s+", " "));

        //check if the contact number is valid (e.g., not empty, contains only digits, etc.) and has length of exactly 10
        if (!bookRequest.getOwnerContact().matches("\\d{10}")) {
            return null; // invalid contact number
        }

        // // Check if a vehicle with the same number is already parked
        // for (Map.Entry<String, Ticket> entry : ticketMap.entrySet()) {
        //     if (entry.getValue().getVehicleNo().equals(bookRequest.getVehicleNo())) {
        //         return null; // a vehicle with this number is already parked
        //     }
        // }

        // Check if a vehicle with the same number is already parked (not completed)
        Ticket existingTicket = ticketRepository.findByVehicleNoAndCompletedFalse(bookRequest.getVehicleNo());
        if (existingTicket != null) {
            return null; // a vehicle with this number is already parked (active)
        }

        ParkingSpot freeParkingSpot = null;
        for(ParkingSpot parkingSpot : parkingLot.getParkingSpotList()) {
            if(bookRequest.getType().equals(parkingSpot.getType()) && !parkingSpot.isBooked()) {
                freeParkingSpot = parkingSpot;
                parkingSpot.setBooked(true);
                break;
            }
        }
        if(freeParkingSpot == null) return null;

        displayBoard.changeFreeParkingSpot(freeParkingSpot);
        String id = generateRandomId();
        Ticket ticket = new Ticket(
                id,
                bookRequest.getOwnerName(),
                bookRequest.getOwnerContact(),
                LocalTime.now().truncatedTo(ChronoUnit.SECONDS), // Entry time
                null, // Exit time will be set at the time exit
                LocalDate.now(), // Entry date
                null, // Exit date will be set at the time exit
                bookRequest.getVehicleNo(),
                freeParkingSpot
        );
        // Store the ticket in the map
        // ticketMap.put(id, ticket);
        ticketRepository.save(ticket);

        System.out.println("");
        System.out.println("Vehicle parked successfully with ticket ID: " + id);
        // int size = ticketMap.size();
        // System.out.println("Current number of tickets: " + size);
        System.out.println("");
        
        return ticket;
    }

    @Override
    public FreeRequest UnparkVehicle(String ticketId) {
        if (ticketId == null) {
            return null; // invalid ticket ID
        }

        //make sure that the ticketId is not leading or trailing with spaces and also no extra spaces in between
        ticketId = ticketId.trim().replaceAll("\\s+", " ");

        // if (!ticketMap.containsKey(ticketId) ) {
        //     return null; // Ticket not found
        // }

        // Ticket ticket = ticketMap.get(ticketId);
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket == null || ticket.isCompleted()) {
            return null; // Ticket not found or already completed
        }

        ticket.setExitTime(LocalTime.now().truncatedTo(ChronoUnit.SECONDS));
        ticket.setExitDate(LocalDate.now());
        // ParkingSpot parkingSpot = ticket.getParkingSpot();
        ticket.getParkingSpot().setBooked(false);
        displayBoard.changeFreeParkingSpot(ticket.getParkingSpot());

        long totalTime = countTime(ticket);
        long cost = calculateCost(ticket, totalTime);

        System.out.println("");
        System.out.println("Total time parked (in minutes): " + totalTime);
        System.out.println("Total cost: " + cost);
        System.out.println("");

        FreeRequest freeRequest = new FreeRequest(
                ticket.getOwnerName(),
                ticket.getOwnerContact(),
                ticket.getParkingSpot().getType(),
                ticket.getVehicleNo(),
                ticket.getId(),
                cost,
                totalTime
        );

        ticket.setCompleted(true);
        ticketRepository.save(ticket);
        // ticketMap.remove(ticketId);
        return freeRequest;
    }

    private long countTime(Ticket ticket) {
        LocalTime entryTime = ticket.getEntryTime();
        LocalTime exitTime = ticket.getExitTime();
        if (exitTime == null) {
            exitTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);
        }
        LocalDate entryDate = ticket.getEntryDate();
        LocalDate exitDate = ticket.getExitDate();
        if (exitDate == null) {
            exitDate = LocalDate.now();
        }
        long minutes = ChronoUnit.MINUTES.between(entryTime, exitTime);
        return minutes + ChronoUnit.DAYS.between(entryDate, exitDate) * 1440; // 1440 minutes in a day
    }

    private long calculateCost(Ticket ticket, long totalTime) {
        totalTime = Math.max(0, totalTime - 30); //first 30 minutes are free
        double totalTimeinHours = totalTime / 60.0; // Convert to hours
        int costPerMinute = ticket.getParkingSpot().getCost();
        double totalCost = totalTimeinHours * costPerMinute;
        return Math.round(totalCost); // Round to nearest integer
    }

    private String generateRandomId() {
        // Using UUID ensures uniqueness
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    @Override
    public Ticket UpdateParkedVehicle(String ticketId, BookRequest bookRequest) {
        if(ticketId == null || !ticketRepository.existsById(ticketId)) {
            return null; // Ticket not found
        }
        if (bookRequest == null || bookRequest.getVehicleNo() == null || bookRequest.getVehicleNo().isEmpty() || bookRequest.getOwnerName() == null || bookRequest.getOwnerContact() == null || bookRequest.getOwnerName().isEmpty() || bookRequest.getOwnerContact().isEmpty()) {
            return null; // Invalid request data
        }

        //make sure that the variables are not leading or trailing with spaces and also no extra spaces in between
        bookRequest.setType(bookRequest.getType().trim().replaceAll("\\s+", " "));
        bookRequest.setVehicleNo(bookRequest.getVehicleNo().trim().replaceAll("\\s+", " "));
        bookRequest.setOwnerName(bookRequest.getOwnerName().trim().replaceAll("\\s+", " "));
        bookRequest.setOwnerContact(bookRequest.getOwnerContact().trim().replaceAll("\\s+", " "));
        
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setVehicleNo(bookRequest.getVehicleNo());
            ticket.setOwnerName(bookRequest.getOwnerName());
            ticket.setOwnerContact(bookRequest.getOwnerContact());
            ticketRepository.save(ticket);
        }
        return ticket;
    }

    @Override
    public java.util.List<Ticket> getActiveParkedVehicles() {
        // Return only currently parked vehicles (not completed)
        return ticketRepository.findByCompletedFalse();
    }

    @Override
    public java.util.List<Ticket> getCompletedParkedVehicles() {
        // Return only completed vehicles
        return ticketRepository.findByCompletedTrue();
    }

    @Override
    public java.util.List<Ticket> getAllParkedVehicles() {
        // Return all parked vehicles (both active and completed)
        return ticketRepository.findAll();
    }
}