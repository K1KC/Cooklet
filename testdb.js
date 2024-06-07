const mongoose = require('mongoose');
const connectDB = require('./connectdb');
const RecipeModel = require('./models/recipe.model');
const UserModel = require('./models/user.model');

connectDB().then(async () => {
    try {
        const recipes = await RecipeModel.find().populate('recipe_maker', 'username');
        recipes.forEach(recipe => {
            if (!recipe.recipe_maker) {
                console.log(`Recipe ${recipe._id} has no maker`);
            } else {
                console.log(`Recipe ${recipe._id} is made by ${recipe.recipe_maker.username}`);
            }
        });

        const users = await UserModel.find();
        users.forEach(user => {
            console.log(`User ${user._id} is ${user.username}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
});
