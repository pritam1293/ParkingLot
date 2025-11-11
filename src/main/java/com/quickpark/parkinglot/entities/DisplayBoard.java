package com.quickpark.parkinglot.entities;

public class DisplayBoard {
    private int freeMiniParkingSpots;
    private int freeCompactParkingSpots;
    private int freeLargeParkingSpots;
    private int bookedMiniParkingSpots;
    private int bookedCompactParkingSpots;
    private int bookedLargeParkingSpots;
    private static DisplayBoard displayBoard;

    private DisplayBoard() {
        this.freeMiniParkingSpots = 0;
        this.freeCompactParkingSpots = 0;
        this.freeLargeParkingSpots = 0;
        this.bookedMiniParkingSpots = 0;
        this.bookedCompactParkingSpots = 0;
        this.bookedLargeParkingSpots = 0;
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

    public int getBookedMiniParkingSpots() {
        return bookedMiniParkingSpots;
    }

    public void setBookedMiniParkingSpots(int bookedMiniParkingSpots) {
        this.bookedMiniParkingSpots = bookedMiniParkingSpots;
    }

    public int getBookedCompactParkingSpots() {
        return bookedCompactParkingSpots;
    }

    public void setBookedCompactParkingSpots(int bookedCompactParkingSpots) {
        this.bookedCompactParkingSpots = bookedCompactParkingSpots;
    }

    public int getBookedLargeParkingSpots() {
        return bookedLargeParkingSpots;
    }

    public void setBookedLargeParkingSpots(int bookedLargeParkingSpots) {
        this.bookedLargeParkingSpots = bookedLargeParkingSpots;
    }

    public void changeFreeParkingSpot(ParkingSpot parkingSpot){
        if(parkingSpot.getType().equals("large")) {
            this.freeLargeParkingSpots += parkingSpot.isBooked() ? -1 : 1;
        }
        else if(parkingSpot.getType().equals("mini")) {
            this.freeMiniParkingSpots += parkingSpot.isBooked() ? -1 : 1;;
        }
        else if(parkingSpot.getType().equals("compact")) {
            this.freeCompactParkingSpots += parkingSpot.isBooked() ? -1 : 1;;
        }
    }
}
