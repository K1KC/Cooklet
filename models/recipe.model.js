const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    recipe_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true,
    },
    recipe_name: {
        type: String,
        required: true,
    },
    recipe_desc: {
        type: String,
        required: true,
    },
    ingredient_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    recipe_steps: [{
        type: String,
        required: true
    }]
});

const Recipe = mongoose.model.Recipes || mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
