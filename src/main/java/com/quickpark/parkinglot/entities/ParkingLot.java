package com.quickpark.parkinglot.entities;

import java.util.ArrayList;
import java.util.List;

public class ParkingLot {

    private Entrance entrance;
    private Exit exit;
    private DisplayBoard displayBoard;
    private List<ParkingSpot> parkingSpotList;

    public ParkingLot() {
        this.displayBoard = DisplayBoard.getInstance();
        this.entrance = new Entrance();
        this.exit = new Exit();
        this.parkingSpotList = new ArrayList<ParkingSpot>();
        for(int i=0;i<5;i++) {
            parkingSpotList.add(new MiniParkingSpot(3*i + 1));
            parkingSpotList.add(new LargeParkingSpot(3*i + 2));
            parkingSpotList.add(new CompactParkingSpot(3*i + 3));
        }
        this.setFreeParkingSpots();
    }

    public Entrance getEntrance() {
        return entrance;
    }

    public void setEntrance(Entrance entrance) {
        this.entrance = entrance;
    }

    public Exit getExit() {
        return exit;
    }

    public void setExit(Exit exit) {
        this.exit = exit;
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
        parkingSpotList.forEach(parkingSpot -> displayBoard.addFreeParkingSpot(parkingSpot));
    }
}