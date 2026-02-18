package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.ParkedTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;
import java.util.List;

@Repository
public interface ParkedTicketRepository extends JpaRepository<ParkedTicket, Long> {

    ParkedTicket findByVehicleNo(String vehicleNo);

    boolean existsByVehicleNo(String vehicleNo);

    @NonNull
    List<ParkedTicket> findAll();

    List<ParkedTicket> findByParkingSpotType(String type);

    List<ParkedTicket> findByEmail(String email);

    List<ParkedTicket> findByOwnerContact(String ownerContact);

    ParkedTicket findByParkingSpotLocation(String location);

    void deleteByVehicleNo(String vehicleNo);
}
