package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.Ticket;
import com.quickpark.parkinglot.response.DisplayResponse;

public interface IParkingService {
    public DisplayResponse getFreeParkingSpots();

    public Ticket ParkVehicle(BookRequest bookRequest);

    public FreeRequest UnparkVehicle(String ticketId);

    public Ticket UpdateParkedVehicle(String ticketId, BookRequest bookRequest);

    public java.util.List<Ticket> getActiveParkedVehicles();

    public java.util.List<Ticket> getCompletedParkedVehicles();

    public java.util.List<Ticket> getAllParkedVehicles();
}
