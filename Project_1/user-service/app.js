// user-service/app.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS library

dotenv.config();
const app = express();

// Enable CORS for all requests
app.use(cors());

// Use JSON parsing middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the user schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User created');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user and validate password
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// Sample route to get user list (add your actual logic here if needed)
app.get('/users', async (req, res) => {
    const users = await User.find(); // Fetch all users from the database
    res.json(users);
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
