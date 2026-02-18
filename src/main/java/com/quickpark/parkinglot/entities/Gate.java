package com.quickpark.parkinglot.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gates")
public class Gate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String guardName;
    private boolean status; // true for open, false for closed

    public Gate(Long id, String name, String type, String guardName, boolean status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.guardName = guardName;
        this.status = status;
    }

    public String getId() {
        if (id == null) {
            return null;
        }
        return String.valueOf(id);
    }

    public void setId(String id) {
        if (id != null && !id.isEmpty()) {
            this.id = Long.parseLong(id);
        }
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
