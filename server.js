const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const IngredientModel = require('./models/ingredient.model');
const connectDB = require('./connectdb');

// Connect to MongoDB
connectDB();

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Test route to check if server is running
app.get('/test', (req, res) => {
    res.send('Server is running');
});

// Define a route to get all ingredients
app.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await IngredientModel.find({}, 'ingredient_name'); // Retrieve only the ingredient_name field
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
