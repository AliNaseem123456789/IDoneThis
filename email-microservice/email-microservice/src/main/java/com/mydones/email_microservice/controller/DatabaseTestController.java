package com.mydones.email_microservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class DatabaseTestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db/test")
    public Map<String, Object> testDb() {
        try {
            String result = jdbcTemplate.queryForObject("SELECT 1", String.class);
            return Map.of("status", "Connected!", "result", result);
        } catch (Exception e) {
            return Map.of("status", "Failed", "error", e.getMessage());
        }
    }
}