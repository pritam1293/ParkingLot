package com.quickpark.parkinglot.custom;

public class Tuple extends Pair {
    private Object third;

    public Tuple() {
        super();
    }

    public Tuple(Object first, Object second, Object third) {
        super(first, second);
        this.third = third;
    }

    public Object getThird() {
        return third;
    }

    public void setThird(Object third) {
        this.third = third;
    }

    @Override
    public String toString() {
        return "Tuple{" +
                "first=" + getFirst() +
                ", second=" + getSecond() +
                ", third=" + getThird() +
                '}';
    }
}
