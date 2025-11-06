package com.quickpark.parkinglot.service;

import java.util.Map;

public interface IAdminService {
    public Map<String, Object> addParkingSpots(Map<String, Integer> parkingSpotRequest);
}