package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.ParkedTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;
import java.util.List;

@Repository
public interface ParkedTicketRepository extends MongoRepository<ParkedTicket, String> {
    
    ParkedTicket findByVehicleNo(String vehicleNo);

    boolean existsByVehicleNo(String vehicleNo);

    boolean existsById(@NonNull String id);  
    
    @NonNull
    List<ParkedTicket> findAll();

    List<ParkedTicket> findByEmail(String email);

    List<ParkedTicket> findByOwnerContact(String ownerContact);

    void deleteByVehicleNo(String vehicleNo);
}
