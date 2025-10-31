package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findByContactNo(String contactNo);
    Optional<User> findByFirstName(String firstName);
    Optional<User> findByLastName(String lastName);
}
    