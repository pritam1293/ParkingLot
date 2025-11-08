package com.quickpark.parkinglot.service;

import java.util.Map;
import java.util.List;
import com.quickpark.parkinglot.custom.Pair;

public interface IAdminService {
    public Map<String, Object> addParkingSpots(Map<String, Integer> parkingSpotRequest);

    public Map<String, Object> updateParkingSpotStatus(Map<String, Boolean> statusRequest);

    public Map<String, Object> getAllParkingSpots();

    public List<Pair> getAllParkedSpots();

    public List<Pair> getAllAvailableSpots();

    public List<Pair> getAllSpotsByActiveStatus(boolean active);

    public long calculateRevenueBetweenDates(String startDate, String endDate);
}