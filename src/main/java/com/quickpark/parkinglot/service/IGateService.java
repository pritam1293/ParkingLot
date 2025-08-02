package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.entities.Gate;
import java.util.List;

public interface IGateService {
    public Gate addGate(Gate gate);

    public Gate updateGate(String id, Gate gate);

    public Gate getGateById(String id);

    public List<Gate> getAllActiveGates();

    public long countActiveGates();

    public List<Gate> getAllInactiveGates();

    public List<Gate> getAllGates();
}
