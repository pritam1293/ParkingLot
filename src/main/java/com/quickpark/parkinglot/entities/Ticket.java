package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

public abstract class Ticket {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String ownerContact;
    private LocalDateTime entryTime;
    @Indexed(unique = true)
    private String vehicleNo;
    private ParkingSpot parkingSpot;

    public Ticket() {
    }

    public Ticket(String id, String firstName, String lastName, String email, String ownerContact, LocalDateTime entryTime, String vehicleNo, ParkingSpot parkingSpot) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.ownerContact = ownerContact;
        this.entryTime = entryTime;
        this.vehicleNo = vehicleNo;
        this.parkingSpot = parkingSpot;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOwnerContact() {
        return ownerContact;
    }

    public void setOwnerContact(String ownerContact) {
        this.ownerContact = ownerContact;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public ParkingSpot getParkingSpot() {
        return parkingSpot;
    }

    public void setParkingSpot(ParkingSpot parkingSpot) {
        this.parkingSpot = parkingSpot;
    }

    @Override
    public String toString() {
        return "Ticket{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", ownerContact='" + ownerContact + '\'' +
                ", entryTime=" + entryTime +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", parkingSpot=" + parkingSpot +
                '}';
    }
}
