package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {
    List<Gate> findAllByStatus(boolean status);
}
