package com.mydones.email_microservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMQConfig {

    // Exchange
    public static final String EMAIL_EXCHANGE = "email.exchange";
    public static final String DLX_EXCHANGE = "email.dlx";

    // Queues
    public static final String SEND_QUEUE = "email.send";
    public static final String REMINDER_QUEUE = "email.reminder";
    public static final String FAILED_QUEUE = "email.failed";
    public static final String SEND_RETRY_QUEUE = "email.send.retry";
    public static final String REMINDER_RETRY_QUEUE = "email.reminder.retry";

    // Routing Keys
    public static final String SEND_ROUTING_KEY = "email.send";
    public static final String REMINDER_ROUTING_KEY = "email.reminder";
    public static final String FAILED_ROUTING_KEY = "failed";

    @Bean
    public TopicExchange emailExchange() {
        return new TopicExchange(EMAIL_EXCHANGE, true, false);
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE, true, false);
    }

    @Bean
    public Queue sendQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", DLX_EXCHANGE);
        args.put("x-dead-letter-routing-key", FAILED_ROUTING_KEY);
        args.put("x-message-ttl", 60000);
        return new Queue(SEND_QUEUE, true, false, false, args);
    }

    @Bean
    public Queue reminderQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", DLX_EXCHANGE);
        args.put("x-dead-letter-routing-key", FAILED_ROUTING_KEY);
        args.put("x-message-ttl", 60000);
        return new Queue(REMINDER_QUEUE, true, false, false, args);
    }

    @Bean
    public Queue failedQueue() {
        return new Queue(FAILED_QUEUE, true);
    }

    @Bean
    public Binding sendBinding() {
        return BindingBuilder
            .bind(sendQueue())
            .to(emailExchange())
            .with(SEND_ROUTING_KEY);
    }

    @Bean
    public Binding reminderBinding() {
        return BindingBuilder
            .bind(reminderQueue())
            .to(emailExchange())
            .with(REMINDER_ROUTING_KEY);
    }

    @Bean
    public Binding failedBinding() {
        return BindingBuilder
            .bind(failedQueue())
            .to(deadLetterExchange())
            .with(FAILED_ROUTING_KEY);
    }

    @Bean
public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
    return new Jackson2JsonMessageConverter();
}
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jackson2JsonMessageConverter());
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = 
            new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jackson2JsonMessageConverter());
        factory.setConcurrentConsumers(3);
        factory.setMaxConcurrentConsumers(10);
        factory.setPrefetchCount(5);
        return factory;
    }
}