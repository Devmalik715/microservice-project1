// product-service/app.js
const express = require('express');  // Import Express framework
const mongoose = require('mongoose');  // Import Mongoose for MongoDB interaction
const dotenv = require('dotenv');  // Import dotenv for environment variables
const cors = require('cors'); // Import the CORS library

dotenv.config();  // Load environment variables from .env file
const app = express();  // Create an Express application

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());  

// Connect to MongoDB using the URI from the environment variables
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a Mongoose schema for products
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
});

// Create a Mongoose model based on the schema
const Product = mongoose.model('Product', productSchema);

// Create a new product
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);  // Create a new product instance
    await newProduct.save();  // Save the product to the database
    res.status(201).send(newProduct);  // Respond with the created product and status 201 (Created)
});

// Get all products
app.get('/products', async (req, res) => {
    const products = await Product.find();  // Retrieve all products from the database
    res.json(products);  // Respond with the list of products
});

// Update a product
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;  // Get the product ID from the request parameters
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });  // Update the product
    res.json(updatedProduct);  // Respond with the updated product
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;  // Get the product ID from the request parameters
    await Product.findByIdAndDelete(id);  // Delete the product
    res.status(204).send();  // Respond with status 204 (No Content)
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});
