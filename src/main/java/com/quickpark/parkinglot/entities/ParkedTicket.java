package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ParkedTickets")
public class ParkedTicket extends Ticket {

    public ParkedTicket() {
        super();
    }

    public ParkedTicket(String id, String firstName, String lastName, String email,
        String ownerContact, LocalDateTime entryTime, String vehicleNo, String vehicleModel, ParkingSpot parkingSpot) {
        super(id, firstName, lastName, email, ownerContact, entryTime, vehicleNo, vehicleModel, parkingSpot);
    }
}
