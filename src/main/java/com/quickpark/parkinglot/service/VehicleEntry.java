package com.quickpark.parkinglot.service;

public class VehicleEntry {
    private String ticketNo;
    private String number;

    public VehicleEntry(String number,String ticketNo) {
        this.number = number;
        this.ticketNo = ticketNo;
    }

    public VehicleEntry() {

    }

    public String getTicketNo() {
        return ticketNo;
    }

    public void setTicketNo(String ticketNo) {
        this.ticketNo = ticketNo;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    @Override
    public String toString() {
        return "VehicleEntry{" +
                "ticketNo='" + ticketNo + '\'' +
                ", number='" + number + '\'' +
                '}';
    }
}
