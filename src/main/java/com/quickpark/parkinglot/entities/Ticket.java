package com.quickpark.parkinglot.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tickets")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String ownerContact;
    private LocalDateTime entryTime;
    @Column(unique = true, nullable = false, length = 50)
    private String vehicleNo;
    private String vehicleModel;
    @ManyToOne
    @JoinColumn(name = "parking_spot_id")
    private ParkingSpot parkingSpot;

    public Ticket() {
    }

    public Ticket(Long id, String firstName, String lastName, String email, String ownerContact,
            LocalDateTime entryTime, String vehicleNo, String vehicleModel, ParkingSpot parkingSpot) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.ownerContact = ownerContact;
        this.entryTime = entryTime;
        this.vehicleNo = vehicleNo;
        this.vehicleModel = vehicleModel;
        this.parkingSpot = parkingSpot;
    }

    public String getId() {
        if (id == null) {
            return null;
        }
        return String.valueOf(id);
    }

    public void setId(String id) {
        if (id != null && !id.isEmpty()) {
            this.id = Long.parseLong(id);
        }
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

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
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
                ", vehicleModel='" + vehicleModel + '\'' +
                ", parkingSpot=" + parkingSpot +
                '}';
    }
}
