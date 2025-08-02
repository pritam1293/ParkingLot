package com.quickpark.parkinglot.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "gates")
public class Gate {
    @Id
    private String id;
    private String name;
    private String type;
    private String guardName;
    private boolean status; // true for open, false for closed

    public Gate(String id, String name, String type, String guardName, boolean status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.guardName = guardName;
        this.status = status;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
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
    public boolean setStatus(boolean status) {
        return this.status;
    }
    public boolean getStatus() {
        return status;
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
