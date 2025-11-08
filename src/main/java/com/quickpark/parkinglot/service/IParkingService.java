package com.quickpark.parkinglot.service;

import java.util.Map;

import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.response.DisplayResponse;
import com.quickpark.parkinglot.entities.UnparkedTicket;

public interface IParkingService {
    public DisplayResponse getFreeParkingSpots();

    public ParkedTicket ParkVehicle(Map<String, String> requestBody);

    public UnparkedTicket UnparkVehicle(String ticketId);

    public ParkedTicket UpdateParkedVehicle(String ticketId, String vehicleNo);
}
