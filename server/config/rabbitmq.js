// config/rabbitmq.js
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

class RabbitMQManager {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.isConnected = false;
        this.exchange = 'email.exchange';
    }

    async connect() {
        if (this.isConnected) return;
        
        try {
            const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
            this.connection = await amqp.connect(rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            
            // Only declare exchange (queues are managed by Spring Boot)
            await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
            
            this.connection.on('close', () => {
                console.log('RabbitMQ connection closed');
                this.isConnected = false;
                this.reconnect();
            });
            
            this.isConnected = true;
            console.log('RabbitMQ producer ready');
            console.log(`Exchange: ${this.exchange}`);
        } catch (error) {
            console.error('RabbitMQ connection failed:', error.message);
            throw error;
        }
    }

    async reconnect() {
        console.log('Reconnecting to RabbitMQ in 5 seconds...');
        setTimeout(async () => {
            try {
                await this.connect();
            } catch (error) {
                console.error('Reconnection failed:', error.message);
                this.reconnect();
            }
        }, 5000);
    }

    async publish(routingKey, message) {
        try {
            if (!this.channel || !this.isConnected) {
                await this.connect();
            }
            
            if (!this.channel) {
                throw new Error('No channel available');
            }
            
            this.channel.publish(
                this.exchange, 
                routingKey, 
                Buffer.from(JSON.stringify(message)), 
                {
                    persistent: true,
                    contentType: 'application/json',
                    timestamp: Date.now()
                }
            );
            
            console.log(`Published to ${routingKey}: ${message.type || 'message'}`);
            return { success: true };
        } catch (error) {
            console.error('Publish failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async close() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
        this.isConnected = false;
        console.log('RabbitMQ connection closed');
    }
}

export default new RabbitMQManager();