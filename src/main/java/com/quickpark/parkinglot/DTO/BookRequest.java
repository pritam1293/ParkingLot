package com.quickpark.parkinglot.DTO;

public class BookRequest {
    private String type;
    private String vehicleNo;
    private String ownerName;
    private String ownerContact;

    public BookRequest(String type, String vehicleNo, String ownerName, String ownerContact) {
        this.type = type;
        this.vehicleNo = vehicleNo;
        this.ownerName = ownerName;
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

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
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
                ", ownerName='" + ownerName + '\'' +
                ", ownerContact='" + ownerContact + '\'' +
                '}';
    }
}
