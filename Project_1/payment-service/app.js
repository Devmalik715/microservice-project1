const express = require('express');
const dotenv = require('dotenv');
const amqp = require('amqplib');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS library

dotenv.config();
const app = express();

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection for payments (if you plan to store payments)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Payment schema and model for MongoDB
const paymentSchema = new mongoose.Schema({
    orderId: String,
    amount: Number,
    status: { type: String, default: 'pending' },
    paymentMethod: String
});

const Payment = mongoose.model('Payment', paymentSchema);

// RabbitMQ setup
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const PAYMENT_QUEUE = 'paymentQueue';

// Function to connect to RabbitMQ and send a message
async function sendMessageToQueue(queue, message) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Sent message to ${queue}:`, message);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error.message);
    }
}

// Payment endpoint
app.post('/payment', async (req, res) => {
    const { orderId, amount, paymentMethod } = req.body;

    // Validate input
    if (!orderId || !amount || !paymentMethod) {
        return res.status(400).send('Order ID, amount, and payment method are required');
    }

    // Simulate payment processing and payment status
    const paymentStatus = { orderId, amount, paymentMethod, status: 'confirmed' };

    // Save the payment to MongoDB (optional)
    const newPayment = new Payment(paymentStatus);
    await newPayment.save();  // Save payment to the database

    // Notify the Order Service (update order status)
    try {
        await axios.put(`http://order-service:7000/orders/${orderId}`, { status: 'paid' });
        console.log('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error.message);
        return res.status(500).send('Error updating order status');
    }

    // Send payment confirmation to RabbitMQ
    await sendMessageToQueue(PAYMENT_QUEUE, paymentStatus);

    res.status(201).send(paymentStatus);  // Respond with the created payment status
});

// GET /payment endpoint to fetch payment status (optional)
app.get('/payment', async (req, res) => {
    try {
        // Fetch all payments from the database (you can adjust this logic as needed)
        const payments = await Payment.find({});
        res.status(200).json(payments);  // Return the list of payments
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).send('Error fetching payment information');
    }
});

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
