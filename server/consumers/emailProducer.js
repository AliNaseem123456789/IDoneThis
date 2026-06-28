import amqp from 'amqplib';

let channel = null;
let connection = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqps://fovvrnlv:pnKVJVM5aYMqWceTiF5dS_AXyC9MJguI@capybara.lmq.cloudamqp.com/fovvrnlv';
const EMAIL_EXCHANGE = 'email.exchange';
const SEND_ROUTING_KEY = 'email.send';
const REMINDER_ROUTING_KEY = 'email.reminder';

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Assert exchange 
        await channel.assertExchange(EMAIL_EXCHANGE, 'topic', { durable: true });
        
        console.log('Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.error('RabbitMQ connection failed:', error.message);
        throw error;
    }
};

await connectRabbitMQ();

// Producer: Queue email for sending
export const queueEmail = async (emailData) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        
        const message = {
            to: emailData.to,
            subject: emailData.subject,
            template: emailData.template || 'default',
            templateData: emailData.templateData || {},
            type: emailData.type || 'email'
        };
        
        const result = channel.publish(
            EMAIL_EXCHANGE,
            SEND_ROUTING_KEY,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }  // Message survives broker restart
        );
        
        console.log(`Email queued for: ${emailData.to}`);
        return { success: true, messageId: message.id };
        
    } catch (error) {
        console.error('Failed to queue email:', error.message);
        return { success: false, error: error.message };
    }
};

// Producer: Queue reminder
export const queueReminder = async (reminderData) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        
        const message = {
            userId: reminderData.userId,
            subject: reminderData.subject || 'Daily Reminder',
            message: reminderData.message || 'Don\'t forget your tasks!',
            type: reminderData.type || 'reminder'
        };
        
        const result = channel.publish(
            EMAIL_EXCHANGE,
            REMINDER_ROUTING_KEY,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );
        
        console.log(`Reminder queued for user: ${reminderData.userId}`);
        return { success: true };
        
    } catch (error) {
        console.error('Failed to queue reminder:', error.message);
        return { success: false, error: error.message };
    }
};

// Graceful shutdown
export const closeConnection = async () => {
    try {
        await channel?.close();
        await connection?.close();
        console.log('RabbitMQ connection closed');
    } catch (error) {
        console.error('Error closing RabbitMQ connection:', error.message);
    }
};

export default { queueEmail, queueReminder, closeConnection };