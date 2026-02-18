package com.quickpark.parkinglot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quickpark.parkinglot.entities.UnparkedTicket;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.lang.NonNull;

@Repository
public interface UnparkedTicketRepository extends JpaRepository<UnparkedTicket, Long> {
    UnparkedTicket findByVehicleNo(String vehicleNo);

    boolean existsByVehicleNo(String vehicleNo);

    List<UnparkedTicket> findByExitTime(LocalDateTime exitTime);

    List<UnparkedTicket> findByExitTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    List<UnparkedTicket> findByEmail(String email);

    List<UnparkedTicket> findByOwnerContact(String ownerContact);

    @NonNull
    List<UnparkedTicket> findAll();
}