package com.quickpark.parkinglot.response;

public class DisplayResponse {
    public int freeMini;
    public int freeCompact;
    public int freeLarge;
    public int bookedMini;
    public int bookedCompact;
    public int bookedLarge;

    public DisplayResponse() {
        this.freeMini = 0;
        this.freeCompact = 0;
        this.freeLarge = 0;
        this.bookedMini = 0;
        this.bookedCompact = 0;
        this.bookedLarge = 0;
    }
}
