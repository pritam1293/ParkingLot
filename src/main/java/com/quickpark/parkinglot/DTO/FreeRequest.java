package com.quickpark.parkinglot.DTO;

public class FreeRequest {
    private String type;
    private String vehicleNo;
    private String ticketId;
    private long totalCost;
    private long totalTime;

    public FreeRequest(String type, String vehicleNo, String ticketId, long totalCost, long totalTime) {
        this.type = type;
        this.vehicleNo = vehicleNo;
        this.ticketId = ticketId;
        this.totalCost = totalCost;
        this.totalTime = totalTime;
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
                "type='" + type + '\'' +
                ", vehicleNo='" + vehicleNo + '\'' +
                ", ticketId='" + ticketId + '\'' +
                ", totalCost=" + totalCost +
                ", totalTime=" + totalTime +
                '}';
    }
}
