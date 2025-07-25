package com.quickpark.parkinglot.entities;

import java.time.LocalTime;

import java.time.LocalDate;

public class Ticket {
    private String id;
    private LocalTime entryTime;
    private LocalTime exitTime;
    private LocalDate entryDate;
    private LocalDate exitDate;
    private String vehicleNo;
    private ParkingSpot parkingSpot;

    public Ticket(String id, LocalTime entryTime, LocalTime exitTime, LocalDate entryDate, LocalDate exitDate, String vehicleNo, ParkingSpot parkingSpot) {
        this.id = id;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
        this.vehicleNo = vehicleNo;
        this.parkingSpot = parkingSpot;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public ParkingSpot getParkingSpot() {
        return parkingSpot;
    }

    public void setParkingSpot(ParkingSpot parkingSpot) {
        this.parkingSpot = parkingSpot;
    }
}
