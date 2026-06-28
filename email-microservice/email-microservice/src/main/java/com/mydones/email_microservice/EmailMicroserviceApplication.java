package com.mydones.email_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableRetry
@EnableAsync
public class EmailMicroserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmailMicroserviceApplication.class, args);
        System.out.println("Email Microservice Started!");
    }
}
