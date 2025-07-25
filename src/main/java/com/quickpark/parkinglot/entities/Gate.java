package com.quickpark.parkinglot.entities;

public class Gate {
    private int id;
    private String name;
    private String type;
    private String guardName;

    public Gate(int id, String name, String type, String guardName) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.guardName = guardName;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getGuardName() {
        return guardName;
    }
    public void setGuardName(String guardName) {
        this.guardName = guardName;
    }
    @Override
    public String toString() {  
        return "Gate{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", guardName='" + guardName + '\'' +
                '}';
    }
}
