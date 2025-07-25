package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.entities.Gate;
import java.util.List;

public interface IGateService {
    public Gate addGate(Gate gate);

    public Gate updateGate(int id, Gate gate);

    public List<Gate> getGates();
}
