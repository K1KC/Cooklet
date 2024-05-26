const mongoose = require('mongoose');

const IngredientSchema = mongoose.Schema({
    ingredient_id: Number,
    ingredient_name: {
        type: String,
        required: true
    },
    ingredient_measurement: String
})

const IngredienModel = mongoose.model.Ingredient || mongoose.model('Ingredient', IngredientSchema);
module.exports = IngredienModel;