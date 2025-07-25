package com.quickpark.parkinglot.entities;

import java.util.ArrayList;
import java.util.List;

public class ParkingLot {

    private DisplayBoard displayBoard;
    private List<ParkingSpot> parkingSpotList;
    private List<Gate> gateList;

    public ParkingLot() {
        this.displayBoard = DisplayBoard.getInstance();
        this.parkingSpotList = new ArrayList<ParkingSpot>();
        for(int i = 0; i < 10; i++) {
            parkingSpotList.add(new MiniParkingSpot(3 * i + 1));
            parkingSpotList.add(new LargeParkingSpot(3 * i + 2));
            parkingSpotList.add(new CompactParkingSpot(3 * i + 3));
        }
        this.setFreeParkingSpots();
        this.gateList = new ArrayList<Gate>();
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

    public List<Gate> getGateList() {
        return gateList;
    }

    public void setGateList(List<Gate> gateList) {
        this.gateList = gateList;
    }

    private void setFreeParkingSpots() {
        parkingSpotList.forEach(parkingSpot -> displayBoard.changeFreeParkingSpot(parkingSpot));
    }
}