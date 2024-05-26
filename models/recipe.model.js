const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    recipe_id: Number,
    recipe_name: {
        type: String,
        required: '{PATH} is required!'
    },
    recipe_desc: {
        type: String,
        required: '{PATH} is required!'
    }
}, {
    timestamps: true
});

const RecipeModel = mongoose.model.Recipes || mongoose.model('Recipe', RecipeSchema);
module.exports = RecipeModel;
