package com.quickpark.parkinglot.service;

import com.quickpark.parkinglot.entities.Gate;
import java.util.List;
import com.quickpark.parkinglot.repository.GateRepository;
import org.springframework.stereotype.Service;

@Service
public class GateService implements IGateService {
    private final GateRepository gateRepository;

    public GateService(GateRepository gateRepository) {
        this.gateRepository = gateRepository;
    }

    @Override
    public Gate addGate(Gate gate) {
        if (gateRepository.existsById(gate.getId())) {
            return null; // Gate with the same ID already exists
        }
        System.out.println("");
        System.out.println("Gate added: " + gate);
        System.out.println("");
        return gateRepository.save(gate);
    }

    @Override
    public Gate updateGate(String id, Gate gate) {
        if (!gateRepository.existsById(id)) {
            return null;
        }
        gate.setId(id);
        System.out.println("");
        System.out.println("Gate updated: " + gate);
        System.out.println("");
        return gateRepository.save(gate);
    }

    @Override
    public Gate getGateById(String id) {
        return gateRepository.findById(id).orElse(null);
    }

    @Override
    public List<Gate> getAllActiveGates() {
        return gateRepository.findAllByStatus(true);
    }

    @Override
    public long countActiveGates() {
        List<Gate> activeGates = getAllActiveGates();
        return activeGates.size();
    }

    @Override
    public List<Gate> getAllInactiveGates() {
        return gateRepository.findAllByStatus(false);
    }

    @Override
    public List<Gate> getAllGates() {
        return gateRepository.findAll();
    }
}
