package com.quickpark.parkinglot.service;

import java.util.Map;
import java.util.List;
import com.quickpark.parkinglot.entities.ParkingSpot;

public interface IAdminService {
    public Map<String, Object> addParkingSpots(Map<String, Integer> parkingSpotRequest);

    public Map<String, Object> updateParkingSpotStatus(Map<String, Boolean> statusRequest);

    public Map<String, List<ParkingSpot>> getAllParkingSpots();
}