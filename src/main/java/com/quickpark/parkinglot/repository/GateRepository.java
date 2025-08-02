package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.Gate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GateRepository extends MongoRepository<Gate, String> {
    List<Gate> findAllByStatus(boolean status);
}
