package com.quickpark.parkinglot.service;
import com.quickpark.parkinglot.entities.Gate;
import java.util.ArrayList;
import java.util.List;

public class GateService implements IGateService {
    private List<Gate> gates;

    public GateService() {
        this.gates = new ArrayList<>();
    }

    @Override
    public Gate addGate(Gate gate) {
        if (gate == null || gate.getId() <= 0 || gate.getName() == null || gate.getType() == null || gate.getGuardName() == null) {
            return null;
        }

        for (Gate existingGate : gates) {
            if (existingGate.getId() == gate.getId()) {
                return null;
            }
        }

        //make sure the variables are not leading or trailing with spaces and also no extra spaces in between
        gate.setName(gate.getName().trim().replaceAll("\\s+", " "));
        gate.setType(gate.getType().trim().replaceAll("\\s+", " "));
        gate.setGuardName(gate.getGuardName().trim().replaceAll("\\s+", " "));

        gates.add(gate);
        System.out.println("");
        System.out.println("Gate added: " + gate);
        System.out.println("");
        return gate;
    }

    @Override
    public Gate updateGate(int id, Gate gate) {
        if (gate == null || id <= 0 || gate.getName() == null || gate.getType() == null || gate.getGuardName() == null) {
            return null;
        }

        //make sure the variables are not leading or trailing with spaces and also no extra spaces in between
        gate.setName(gate.getName().trim().replaceAll("\\s+", " "));
        gate.setType(gate.getType().trim().replaceAll("\\s+", " "));
        gate.setGuardName(gate.getGuardName().trim().replaceAll("\\s+", " "));

        for (Gate existingGate : gates) {
            if (existingGate.getId() == id) {
                existingGate.setName(gate.getName());
                existingGate.setType(gate.getType());
                existingGate.setGuardName(gate.getGuardName());
                System.out.println("");
                System.out.println("Gate updated: " + existingGate);
                System.out.println("");
                return existingGate;
            }
        }
        return null;
    }

    @Override
    public List<Gate> getGates() {
        return new ArrayList<>(gates); // Return a copy of the list to avoid external modification
    }
}
