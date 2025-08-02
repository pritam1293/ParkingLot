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
import org.springframework.web.bind.annotation.CrossOrigin;

import com.quickpark.parkinglot.service.IGateService;
// import com.quickpark.parkinglot.service.GateService;
import com.quickpark.parkinglot.entities.Gate;

@CrossOrigin(origins = "*")
@RestController
public class GateController {
    private final IGateService gateService;

    public GateController(IGateService gateService) {
        this.gateService = gateService;
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
    public ResponseEntity<String> updateGate(@PathVariable String id, @RequestBody Gate gate) {
        Gate newGate = gateService.updateGate(id, gate);
        if (newGate == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("Gate not found");
        }
        return ResponseEntity.ok("Gate updated successfully");
    }

    @GetMapping("/quickpark/admin/gate/{id}")
    public ResponseEntity<?> getGateById(@PathVariable String id) {
        Gate gate = gateService.getGateById(id);
        if (gate == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("Gate not found");
        }
        return ResponseEntity.ok(gate);
    }

    @GetMapping("/quickpark/admin/active-gates")
    public List<Gate> getActiveGates() {
        return gateService.getAllActiveGates();
    }

    @GetMapping("/quickpark/admin/count-active-gates")
    public long countActiveGates() {
        return gateService.countActiveGates();
    }

    @GetMapping("/quickpark/admin/inactive-gates")
    public List<Gate> getInactiveGates() {
        return gateService.getAllInactiveGates();
    }

    @GetMapping("/quickpark/admin/all-gates")
    public List<Gate> getGates() {
        return gateService.getAllGates();
    }
}
