package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    
    // Find active ticket by vehicle number
    Ticket findByVehicleNoAndCompletedFalse(String vehicleNo);
    
    // Find all active (currently parked) tickets
    java.util.List<Ticket> findByCompletedFalse();

    // Find all completed tickets
    java.util.List<Ticket> findByCompletedTrue();
}
