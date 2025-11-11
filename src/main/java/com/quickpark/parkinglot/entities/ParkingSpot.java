package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "parking_spots")
public abstract class ParkingSpot {
    @Id
    private String id; // unique identifier for the parking spot
    @Version
    private Long version; // for optimistic locking
    private String type; // Mini, Compact, Large
    private int cost; // cost per hour
    /*
     * location is unique spot number, it is the location where the spot is located,
     * e.g. S1-R1-C1 (Section-Row-Column), it means Section 1, Row 1, Column 1
     * for vehicle types sections are 1, 2, 3 for Mini, Compact, Large respectively
     * e.g. for Mini parking spots: S1-R1-C1 means Section 1, Row 1, Column 1
     * for Compact parking spots: S2-R1-C1 means Section 2, Row 1, Column 1
     * for Large parking spots: S3-R1-C1 means Section 3, Row 1, Column 1
     * rows are numbered from 1 to n (number of rows per section)
     * columns are numbered from 1 to m (number of columns per row)
     */
    private String location; // defination above ↑
    /*
     * isActive indicates if the spot is active or deactivated, does not affect
     * booking status,
     * even if deactivated, isBooked can be true, if the spot was booked before
     * deactivation
     * the deactivated spots won't be available for booking by users
     * when admin reactivates the spot, it can be booked again based on isBooked
     * status
     * it is just the case that deactivated spots won't appear in user searches
     * the activation and deactivation is managed by admin only, so regular users
     * cannot change this status
     */
    private boolean isActive; // defination above ↑
    private boolean isBooked; // indicates if the spot is currently booked or not
    private LocalDateTime createdAt; // timestamp when the spot was created
    private LocalDateTime updatedAt; // timestamp when the spot was last updated either booking status or activation
                                     // status

    public ParkingSpot(String type, int cost, String location) {
        this.type = type;
        this.cost = cost;
        this.location = location;
        this.isBooked = false;
        this.isActive = true;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
