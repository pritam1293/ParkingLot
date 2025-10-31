package com.quickpark.parkinglot.DTO;

public class FreeRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String ownerContact;
    private String type;
    private String vehicleNo;
    private String ticketId;
    private long totalCost;
    private long totalTime;

    public FreeRequest(String firstName, String lastName, String email, String ownerContact, String type, String vehicleNo, String ticketId, long totalCost, long totalTime) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.ownerContact = ownerContact;
        this.type = type;
        this.vehicleNo = vehicleNo;
        this.ticketId = ticketId;
        this.totalCost = totalCost;
        this.totalTime = totalTime;
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
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getVehicleNo() {
        return vehicleNo;
    }
    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }
    public String getTicketId() {
        return ticketId;
    }
    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }
    public long getTotalCost() {
        return totalCost;
    }
    public void setTotalCost(long totalCost) {
        this.totalCost = totalCost;
    }
    public long getTotalTime() {
        return totalTime;
    }
    public void setTotalTime(long totalTime) {
        this.totalTime = totalTime;
    }
    @Override
    public String toString() {
        return "FreeRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", ownerContact='" + ownerContact + '\'' +
                ", type='" + type + '\'' +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", ticketId='" + ticketId + '\'' +
                ", totalCost=" + totalCost +
                ", totalTime=" + totalTime +
                '}';
    }
}
