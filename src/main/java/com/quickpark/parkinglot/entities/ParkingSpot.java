package com.quickpark.parkinglot.entities;

public abstract class ParkingSpot {
    private String type;
    private int cost;
    private int location;
    private boolean isBooked;

    public ParkingSpot(String type,int cost,int location) {
        this.type = type;
        this.cost = cost;
        this.location = location;
        this.isBooked = false;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public int getLocation() {
        return location;
    }

    public void setLocation(int location) {
        this.location = location;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        isBooked = booked;
    }

    @Override
    public String toString() {
        return "ParkingSpot{" +
                "type='" + type + '\'' +
                ", cost=" + cost +
                ", location=" + location +
                ", isBooked=" + isBooked +
                '}';
    }
}
