import amqp from 'amqplib';

class EmailProducer {
    constructor() {
        this.queueUrl = process.env.RABBITMQ_URL;
        this.exchange = 'email.exchange';
        this.sendRoutingKey = 'email.send';
        this.reminderRoutingKey = 'email.reminder';
    }

    async sendEmail(to, subject, template, templateData) {
        const connection = await amqp.connect(this.queueUrl);
        const channel = await connection.createChannel();

        const message = {
            to,
            subject,
            template,
            templateData,
            type: 'email'
        };

        channel.publish(this.exchange, this.sendRoutingKey, 
            Buffer.from(JSON.stringify(message)), {
                persistent: true,
                contentType: 'application/json'
            }
        );

        console.log(`Email queued for ${to}`);
        await channel.close();
        await connection.close();
    }

    async sendReminder(userId, subject, message) {
        const connection = await amqp.connect(this.queueUrl);
        const channel = await connection.createChannel();

        const reminderMessage = {
            userId,
            subject,
            message,
            type: 'reminder'
        };

        channel.publish(this.exchange, this.reminderRoutingKey, 
            Buffer.from(JSON.stringify(reminderMessage)), {
                persistent: true,
                contentType: 'application/json'
            }
        );

        console.log(`📤 Reminder queued for user ${userId}`);
        await channel.close();
        await connection.close();
    }
}

export default new EmailProducer();