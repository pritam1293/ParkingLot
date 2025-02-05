package com.quickpark.parkinglot.entities;

public abstract class ParkingSpot {
    private String type;
    private int cost;

    public ParkingSpot(String type,int cost) {
        this.type = type;
        this.cost = cost;
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
}
