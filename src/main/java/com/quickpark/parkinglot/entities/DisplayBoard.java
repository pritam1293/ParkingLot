package com.quickpark.parkinglot.entities;

public class DisplayBoard {
    private int freeMini;
    private int freeCompact;
    private int freeLarge;
    private static DisplayBoard displayBoard;

    private DisplayBoard() {
        this.freeMini = 0;
        this.freeCompact = 0;
        this.freeLarge = 0;
    }

    public static DisplayBoard getInstance() {
        if(DisplayBoard.displayBoard == null) {
            DisplayBoard.displayBoard = new DisplayBoard();
        }
        return DisplayBoard.displayBoard;
    }

    public int getFreeMini() {
        return freeMini;
    }

    public void setFreeMini(int freeMini) {
        this.freeMini = freeMini;
    }

    public int getFreeCompact() {
        return freeCompact;
    }

    public void setFreeCompact(int freeCompact) {
        this.freeCompact = freeCompact;
    }

    public int getFreeLarge() {
        return freeLarge;
    }

    public void setFreeLarge(int freeLarge) {
        this.freeLarge = freeLarge;
    }

    public void addFreeParkingSpot(String type){
        if(type.equals("large")) {
            this.freeLarge += 1;
        } else if(type.equals("mini")) {
            this.freeMini += 1;
        }
        else {
            this.freeCompact += 1;
        }
    }
}
