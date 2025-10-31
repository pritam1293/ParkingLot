package com.quickpark.parkinglot.DTO;

public class BookRequest {
    private String type;
    private String vehicleNo;
    private String firstName;
    private String lastName;
    private String email;
    private String ownerContact;

    public BookRequest(String type, String vehicleNo, String firstName, String lastName, String email, String ownerContact) {
        this.type = type;
        this.vehicleNo = vehicleNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
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

    @Override
    public String toString() {
        return "BookRequest{" +
                "type='" + type + '\'' +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", ownerContact='" + ownerContact + '\'' +
                '}';
    }
}
