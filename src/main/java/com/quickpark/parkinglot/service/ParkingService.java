package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.entities.DisplayBoard;
import com.quickpark.parkinglot.entities.ParkingLot;
import com.quickpark.parkinglot.entities.ParkingSpot;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;

import java.time.LocalDateTime;

public class ParkingService implements IParkingService{

    DisplayBoard displayBoard;

    ParkingLot parkingLot;

    public ParkingService() {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingLot = new ParkingLot();
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
        String id = freeParkingSpot.getType() + "-" +Integer.toString(freeParkingSpot.getLocation());
        return new Ticket(id, LocalDateTime.now(),null, bookRequest.getVehicleNo(), freeParkingSpot);
    }

    @Override
    public Ticket UnparkVehicle(Ticket ticket) {
        ticket.setExitTime(LocalDateTime.now());
        ParkingSpot parkingSpot = ticket.getParkingSpot();
        parkingSpot.setBooked(false);
        displayBoard.changeFreeParkingSpot(ticket.getParkingSpot());
        return ticket;
    }
}
