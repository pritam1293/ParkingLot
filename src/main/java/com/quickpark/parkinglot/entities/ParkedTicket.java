package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;

@Entity
public class ParkedTicket extends Ticket {

    public ParkedTicket() {
        super();
    }

    public ParkedTicket(Long id, String firstName, String lastName, String email,
            String ownerContact, LocalDateTime entryTime, String vehicleNo, String vehicleModel,
            ParkingSpot parkingSpot) {
        super(id, firstName, lastName, email, ownerContact, entryTime, vehicleNo, vehicleModel, parkingSpot);
    }
}
