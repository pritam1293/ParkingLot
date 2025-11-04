package com.quickpark.parkinglot.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "parking_spots")
public abstract class ParkingSpot {
    @Id
    private String id;

    @Version
    private Long version;

    private String type;
    private int cost;
    private int location;
    private boolean isBooked;

    public ParkingSpot(String type, int cost, int location) {
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return "ParkingSpot{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", cost=" + cost +
                ", location=" + location +
                ", isBooked=" + isBooked +
                ", version=" + version +
                '}';
    }
}
