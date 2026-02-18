package com.quickpark.parkinglot.repository;

import com.quickpark.parkinglot.entities.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByContactNo(String contactNo);

    User findByContactNo(String contactNo);

    Optional<User> findByFirstName(String firstName);

    Optional<User> findByLastName(String lastName);
}
