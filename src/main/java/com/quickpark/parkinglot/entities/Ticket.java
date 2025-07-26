package com.quickpark.parkinglot.entities;

import java.time.LocalTime;
import java.time.LocalDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String ownerName;
    private String ownerContact;
    private LocalTime entryTime;
    private LocalTime exitTime;
    private LocalDate entryDate;
    private LocalDate exitDate;
    private String vehicleNo;
    private boolean completed; // New field to track completion status
    private ParkingSpot parkingSpot;

    public Ticket(String id, String ownerName, String ownerContact, LocalTime entryTime, LocalTime exitTime, LocalDate entryDate, LocalDate exitDate, String vehicleNo, ParkingSpot parkingSpot) {
        this.id = id;
        this.ownerName = ownerName;
        this.ownerContact = ownerContact;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
        this.vehicleNo = vehicleNo;
        this.parkingSpot = parkingSpot;
        this.completed = false; // Initialize as not complete
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerContact() {
        return ownerContact;
    }

    public void setOwnerContact(String ownerContact) {
        this.ownerContact = ownerContact;
    }

    public LocalTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalTime exitTime) {
        this.exitTime = exitTime;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public LocalDate getExitDate() {
        return exitDate;
    }

    public void setExitDate(LocalDate exitDate) {
        this.exitDate = exitDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
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
                ", ownerName='" + ownerName + '\'' +
                ", ownerContact='" + ownerContact + '\'' +
                ", entryTime=" + entryTime +
                ", exitTime=" + exitTime +
                ", entryDate=" + entryDate +
                ", exitDate=" + exitDate +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", completed=" + completed +
                ", parkingSpot=" + parkingSpot +
                '}';
    }
}
