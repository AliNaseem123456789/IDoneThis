package com.mydones.email_microservice.service;

import com.mydones.email_microservice.model.EmailLog;
import com.mydones.email_microservice.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailLogService {

    private final EmailLogRepository emailLogRepository;

    @Transactional
    public void logEmail(String to, String subject, String status, String error) {
        EmailLog emailLog = new EmailLog();
        emailLog.setTo(to);
        emailLog.setSubject(subject);
        emailLog.setStatus(status);
        emailLog.setError(error);
        
        if (status.equals("SENT")) {
            emailLog.setSentAt(LocalDateTime.now());
        }
        emailLog.setCreatedAt(LocalDateTime.now());
        
        emailLogRepository.save(emailLog);
        log.info("Email log saved: {} - {}", to, status);
    }
}