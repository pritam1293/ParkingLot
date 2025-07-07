package com.quickpark.parkinglot.entities;

public class DisplayBoard {
    private int freeMiniParkingSpots;
    private int freeCompactParkingSpots;
    private int freeLargeParkingSpots;
    private static DisplayBoard displayBoard;

    private DisplayBoard() {
        this.freeMiniParkingSpots = 0;
        this.freeCompactParkingSpots = 0;
        this.freeLargeParkingSpots = 0;
    }

    public static DisplayBoard getInstance() {
        if(DisplayBoard.displayBoard == null) {
            DisplayBoard.displayBoard = new DisplayBoard();
        }
        return DisplayBoard.displayBoard;
    }

    public int getFreeMiniParkingSpots() {
        return freeMiniParkingSpots;
    }

    public void setFreeMiniParkingSpots(int freeMini) {
        this.freeMiniParkingSpots = freeMini;
    }

    public int getFreeCompactParkingSpots() {
        return freeCompactParkingSpots;
    }

    public void setFreeCompactParkingSpots(int freeCompactParkingSpots) {
        this.freeCompactParkingSpots = freeCompactParkingSpots;
    }

    public int getFreeLargeParkingSpots() {
        return freeLargeParkingSpots;
    }

    public void setFreeLargeParkingSpots(int freeLargeParkingSpots) {
        this.freeLargeParkingSpots = freeLargeParkingSpots;
    }

    public void changeFreeParkingSpot(ParkingSpot parkingSpot){
        if(parkingSpot.getType().equals("large")) {
            this.freeLargeParkingSpots += parkingSpot.isBooked() ? -1 : 1;
        }
        else if(parkingSpot.getType().equals("mini") && !parkingSpot.isBooked()) {
            this.freeMiniParkingSpots += parkingSpot.isBooked() ? -1 : 1;;
        }
        else if(parkingSpot.getType().equals("compact") && !parkingSpot.isBooked()) {
            this.freeCompactParkingSpots += parkingSpot.isBooked() ? -1 : 1;;
        }
    }

//    public void removerFreeParkingSpot()
}
