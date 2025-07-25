package com.quickpark.parkinglot.contoller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.quickpark.parkinglot.service.IGateService;
import com.quickpark.parkinglot.service.GateService;
import com.quickpark.parkinglot.entities.Gate;

@RestController
public class GateController {
    IGateService gateService;

    public GateController() {
        this.gateService = new GateService();
    }

    @PostMapping(path = "/quickpark/admin/addGate", consumes = "application/json")
    public ResponseEntity<?> addGate(@RequestBody Gate gate) {
        Gate newGate = gateService.addGate(gate);
        if (newGate == null) {
            return ResponseEntity.badRequest().body("Invalid gate data, or a gate with the same ID already exists");
        }
        return ResponseEntity.ok(newGate);
    }

    @PutMapping(path = "/quickpark/admin/updateGate/{id}", consumes = "application/json")
    public ResponseEntity<String> updateGate(@PathVariable int id, @RequestBody Gate gate) {
        Gate newGate = gateService.updateGate(id, gate);
        if (newGate == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("Gate not found");
        }
        return ResponseEntity.ok("Gate updated successfully");
    }

    @GetMapping("/quickpark/admin/gates")
    public List<Gate> getGates() {
        return gateService.getGates(); // Assuming getGates() method exists in IGateService
    }
}
