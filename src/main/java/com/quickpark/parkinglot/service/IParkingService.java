package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.DTO.BookRequest;
import com.quickpark.parkinglot.DTO.FreeRequest;
import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;
import com.quickpark.parkinglot.response.DisplayResponse;

public interface IParkingService {
    public DisplayResponse getFreeParkingSpots();

    public ParkedTicket ParkVehicle(BookRequest bookRequest);

    public FreeRequest UnparkVehicle(String ticketId);

    public ParkedTicket UpdateParkedVehicle(String ticketId, BookRequest bookRequest);

    public boolean validateAdminCredentials(String username, String password);

    public java.util.List<ParkedTicket> getActiveParkedVehicles();

    public java.util.List<UnparkedTicket> getCompletedParkedVehicles();

    public long countCompletedVehiclesToday();

    public long countRevenueToday();

    public long countRevenueThisWeek();

    public long countRevenueThisMonth();
}
