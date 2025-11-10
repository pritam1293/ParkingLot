package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "UnparkedTickets")
public class UnparkedTicket extends Ticket {
    private LocalDateTime exitTime;
    private long totalDuration;
    private long totalCost;

    public UnparkedTicket() {
        super();
    }

    public UnparkedTicket(String id, String firstName, String lastName, String email, 
            String ownerContact, LocalDateTime entryTime, LocalDateTime exitTime, 
            long totalDuration, long totalCost, String vehicleNo, String vehicleModel, 
            ParkingSpot parkingSpot) {
        super(id, firstName, lastName, email, ownerContact, entryTime, vehicleNo, vehicleModel, parkingSpot);
        this.exitTime = exitTime;
        this.totalDuration = totalDuration;
        this.totalCost = totalCost;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public long getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(long totalDuration) {
        this.totalDuration = totalDuration;
    }

    public long getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(long totalCost) {
        this.totalCost = totalCost;
    }

    @Override
    public String toString() {
        return "UnparkedTicket{" +
                super.toString() +
                ", exitTime=" + exitTime +
                ", totalDuration=" + totalDuration +
                ", totalCost=" + totalCost +
                "} ";
    }
}