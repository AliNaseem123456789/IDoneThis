package com.mydones.email_microservice.consumers;

import com.mydones.email_microservice.config.RabbitMQConfig;
import com.mydones.email_microservice.model.EmailMessage;
import com.mydones.email_microservice.model.ReminderMessage;
import com.mydones.email_microservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailConsumer {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.SEND_QUEUE)
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(
            delay = 5000,
            multiplier = 2,
            maxDelay = 30000
        )
    )
    public void handleEmailMessage(EmailMessage message) {
        log.info("Received email message: {}", message.getTo());
        try {
            emailService.sendEmail(message);
        } catch (Exception e) {
            log.error("Failed to process email message", e);
            throw new RuntimeException(e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.REMINDER_QUEUE)
    @Retryable(
        value = {Exception.class},
        maxAttempts = 3,
        backoff = @Backoff(
            delay = 5000,
            multiplier = 2,
            maxDelay = 30000
        )
    )
    public void handleReminderMessage(ReminderMessage message) {
        log.info("Received reminder message for user: {}", message.getUserId());
        try {
            emailService.sendReminder(message);
        } catch (Exception e) {
            log.error("Failed to process reminder message", e);
            throw new RuntimeException(e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.FAILED_QUEUE)
    public void handleFailedMessage(Object message) {
        log.error("Failed message received in DLQ: {}", message);

    }
}