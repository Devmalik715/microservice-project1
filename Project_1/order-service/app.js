const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const amqp = require('amqplib'); // Import amqplib for RabbitMQ
const axios = require('axios');
const cors = require('cors'); // Import the CORS library

dotenv.config();
const app = express();

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Order schema and model
const orderSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    status: { type: String, default: 'pending' }
});

const Order = mongoose.model('Order', orderSchema);

// Create a new order with product availability check
app.post('/orders', async (req, res) => {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
        return res.status(400).send('Product ID and User ID are required.');
    }

    try {
        // Check product availability from the product service
        const productResponse = await axios.get(`http://product-service:5000/products/${productId}`);
        const product = productResponse.data;

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Create a new order in MongoDB
        const newOrder = new Order({ productId, userId });
        await newOrder.save();
        res.status(201).json(newOrder);  // Return the created order
    } catch (error) {
        console.error('Error checking product availability:', error);
        return res.status(500).send('Error checking product availability');
    }
});

// Function to receive messages from RabbitMQ
async function receiveMessages(queue) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL); // Use RABBITMQ_URL from .env
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in ${queue}`);
        
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                console.log('Received message:', content);

                // Update order status if needed (status 'paid' from payment service)
                if (content.status === 'paid') {
                    await Order.findOneAndUpdate({ _id: content.orderId }, { status: 'paid' });
                    console.log(`Order ${content.orderId} updated to 'paid'`);
                }

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error('Error receiving messages from RabbitMQ:', error);
    }
}

// Call the function to start listening for messages
receiveMessages('order_updates');

// Get all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
});

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
