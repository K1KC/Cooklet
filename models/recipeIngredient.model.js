const mongoose = require('mongoose');

const RecipeIngredientSchema = mongoose.Schema({
    recipe_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Recipe',
        required: '{PATH} is required!'
    },
    ingredient_id: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }
    ],
    ingredient_qty: {
        type: Number,
        required: '{PATH} is required!'
    }
    
},{
    timestamps: true
});

const RecipeIngredientModel = mongoose.models.RecipeIngredients || mongoose.model('RecipeIngredient', RecipeIngredientSchema);

module.exports = RecipeIngredientModel;