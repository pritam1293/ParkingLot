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
            parkingSpotList.add(new MiniParkingSpot());
            parkingSpotList.add(new LargeParkingSpot());
            parkingSpotList.add(new CompactParkingSpot());
        }
        this.setFreeParkingSpots();
    }

    private void setFreeParkingSpots() {
        parkingSpotList.forEach(parkingSpot -> displayBoard.addFreeParkingSpot(parkingSpot.getType()));
    }
}