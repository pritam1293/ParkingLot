package com.quickpark.parkinglot.entities;

import java.util.ArrayList;
import java.util.List;

public class ParkingLot {

    private DisplayBoard displayBoard;
    private List<ParkingSpot> parkingSpotList;

    public ParkingLot() {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingSpotList = new ArrayList<ParkingSpot>();
        for(int i = 0; i < 50; i++) {
            parkingSpotList.add(new MiniParkingSpot(i + 1));
        }
        for(int i = 0; i < 75; i++) {
            parkingSpotList.add(new CompactParkingSpot(i + 51));
        }
        for(int i = 0; i < 25; i++) {
            parkingSpotList.add(new LargeParkingSpot(i + 126));
        }
        this.setFreeParkingSpots();
    }

    public DisplayBoard getDisplayBoard() {
        return displayBoard;
    }

    public void setDisplayBoard(DisplayBoard displayBoard) {
        this.displayBoard = displayBoard;
    }

    public List<ParkingSpot> getParkingSpotList() {
        return parkingSpotList;
    }

    public void setParkingSpotList(List<ParkingSpot> parkingSpotList) {
        this.parkingSpotList = parkingSpotList;
    }

    private void setFreeParkingSpots() {
        parkingSpotList.forEach(parkingSpot -> displayBoard.changeFreeParkingSpot(parkingSpot));
    }
}