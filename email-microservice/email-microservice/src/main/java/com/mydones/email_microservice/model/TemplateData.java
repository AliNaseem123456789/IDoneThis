package com.mydones.email_microservice.model;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateData implements Serializable {
    private String name;
    private String taskTitle;
    private String reminderText;
    private String link;
}

