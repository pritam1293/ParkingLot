package com.quickpark.parkinglot.DTO;

public class BookRequest {
    private String type;
    private String vehicleNo;

    public BookRequest(String type, String vehicleNo) {
        this.type = type;
        this.vehicleNo = vehicleNo;
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
    @Override
    public String toString() {
        return "BookRequest{" +
                "type='" + type + '\'' +
                ", vehicleNo='" + vehicleNo + '\'' +
                '}';
    }
}
