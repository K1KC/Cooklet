const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const IngredientModel = require('./models/ingredient.model');
const RecipeModel = require('./models/recipe.model');
// const RecipeIngredientModel = require('./models/recipeIngredient.model');
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

// Define a POST route to search recipes
app.post('/api/search', async (req, res) => {
    const { ingredientIds } = req.body;
    try {
        if (!ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
            return res.status(400).json({ error: 'No ingredients selected' });
        }

        // Find recipes that contain all selected ingredient IDs
        const recipes = await RecipeModel.find({ ingredient_ids: { $all: ingredientIds } });

        // Populate ingredient names in recipes
        await RecipeModel.populate(recipes, { path: 'ingredient_ids', select: 'ingredient_name' });

        // Transform the recipes to include ingredient names
        const transformedRecipes = recipes.map(recipe => ({
            recipe_id: recipe.recipe_id,
            recipe_name: recipe.recipe_name,
            recipe_description: recipe.recipe_description,
            ingredients: recipe.ingredient_ids.map(ingredient => ingredient.ingredient_name)
        }));

        res.json(transformedRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
