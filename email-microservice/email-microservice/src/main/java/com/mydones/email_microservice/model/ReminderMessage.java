package com.mydones.email_microservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderMessage implements Serializable {
    private String userId;  
    private String subject;
    private String message;
    private String type;
}