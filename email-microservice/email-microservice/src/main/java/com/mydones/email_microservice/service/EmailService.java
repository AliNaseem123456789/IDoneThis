package com.mydones.email_microservice.service;

import com.mydones.email_microservice.model.EmailMessage;
import com.mydones.email_microservice.model.EmailLog;
import com.mydones.email_microservice.model.ReminderMessage;
import com.mydones.email_microservice.model.TemplateData;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final EmailLogService emailLogService;  

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(EmailMessage emailMessage) throws MessagingException {
        log.info("Sending email to: {}", emailMessage.getTo());

        try {
            // Render template
            Context context = new Context();
            TemplateData data = emailMessage.getTemplateData();
            context.setVariable("name", data.getName());
            context.setVariable("taskTitle", data.getTaskTitle());
            context.setVariable("reminderText", data.getReminderText());
            context.setVariable("link", data.getLink());

            String htmlContent = templateEngine.process(emailMessage.getTemplate(), context);

            // Send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(emailMessage.getTo());
            helper.setSubject(emailMessage.getSubject());
            helper.setText(htmlContent, true);
            mailSender.send(message);
            emailLogService.logEmail(emailMessage.getTo(), emailMessage.getSubject(), "SENT", null);
            log.info("Email sent to: {}", emailMessage.getTo());

        } catch (Exception e) {
            log.error("Failed to send email to: {}", emailMessage.getTo(), e);
            emailLogService.logEmail(emailMessage.getTo(), emailMessage.getSubject(), "FAILED", e.getMessage());
            throw e;
        }
    }

    public void sendReminder(ReminderMessage reminderMessage) throws MessagingException {
        log.info("Sending reminder to user: {}", reminderMessage.getUserId());
        try {
            String userEmail = "alinaseem20021021@gmail.com";  
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(userEmail);
            helper.setSubject(reminderMessage.getSubject());
            helper.setText(reminderMessage.getMessage());

            mailSender.send(message);

            emailLogService.logEmail(userEmail, reminderMessage.getSubject(), "SENT", null);
            log.info("Reminder sent to user: {}", reminderMessage.getUserId());

        } catch (Exception e) {
            log.error("Failed to send reminder to user: {}", reminderMessage.getUserId(), e);
            throw e;
        }
    }
}