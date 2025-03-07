package com.quickpark.parkinglot;

import com.quickpark.parkinglot.entities.ParkingLot;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ParkinglotApplication {

	public static void main(String[] args) {
//		new ParkingLot();
		SpringApplication.run(ParkinglotApplication.class, args);
	}

}
