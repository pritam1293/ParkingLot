package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.entities.DisplayBoard;
import com.quickpark.parkinglot.response.DisplayResponse;

public class ParkingService implements IParkingService{

    DisplayBoard displayBoard;

    public ParkingService() {
        this.displayBoard = DisplayBoard.getInstance();
    }

    @Override
    public DisplayResponse getFreeParkingSpots() {
        DisplayResponse displayResponse = new DisplayResponse();
        displayResponse.mini = displayBoard.getFreeMini();
        displayResponse.large = displayBoard.getFreeLarge();
        displayResponse.compact = displayBoard.getFreeCompact();
        return displayResponse;
    }
}
