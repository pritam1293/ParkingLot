package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;

public class Ticket {
    private String id;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private String vehicleNo;
    private ParkingSpot parkingSpot;

    public Ticket(String id, LocalDateTime entryTime, LocalDateTime exitTime, String vehicleNo, ParkingSpot parkingSpot) {
        this.id = id;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.vehicleNo = vehicleNo;
        this.parkingSpot = parkingSpot;
    }
    //getter-setter
    //Date.now()


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
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
