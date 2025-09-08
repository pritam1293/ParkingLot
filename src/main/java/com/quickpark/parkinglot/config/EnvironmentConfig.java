package com.quickpark.parkinglot.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class EnvironmentConfig {

    @PostConstruct
    public void loadEnvironmentVariables() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .filename(".env")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            // Load all environment variables from .env file
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
            System.out.println("");
            System.out.println("Environment variables loaded from .env file");
        } catch (Exception e) {
            System.err.println("Warning: Could not load .env file: " + e.getMessage());
        }
    }
}
