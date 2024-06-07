const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const IngredientModel = require('./models/ingredient.model');
const RecipeModel = require('./models/recipe.model');
const UserModel = require('./models/user.model');
const connectDB = require('./connectdb');

// Connect to MongoDB
connectDB();

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/result', express.static(path.join(__dirname, 'result')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// Test route to check if server is running
app.get('/test', (req, res) => {
    res.send('Server is running');
});

// Define a route to get all ingredients
app.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await IngredientModel.find({}, 'ingredient_name');
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a POST route to search recipes by ingredients
app.post('/api/searchIngredient', async (req, res) => {
    const { ingredientIds } = req.body;

    if (!ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
        return res.status(400).json({ error: 'No search parameters provided or invalid parameters' });
    }

    try {
        const recipes = await RecipeModel.find({ ingredient_ids: { $all: ingredientIds } }).populate('recipe_maker', 'username');
        console.log('Recipes with populated makers:', recipes);  // Log the recipes
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define a POST route to search recipes by name
app.post('/api/searchName', async (req, res) => {
    const { name } = req.body;
    console.log('Search request received with parameters:', req.body);

    try {
        let recipes;
        if (name) {
            recipes = await RecipeModel.find({ recipe_name: new RegExp(name, 'i') })
                .populate('recipe_maker', 'username');  // Populate the recipe_maker field
            console.log('Found recipes:', recipes);
        } else {
            return res.status(400).json({ error: 'No search parameters provided' });
        }

        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define a route to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await UserModel.find({}, 'username');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
