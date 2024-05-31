const mongoose = require('mongoose');

const IngredientSchema = mongoose.Schema({
    ingredient_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true
    },
    ingredient_name: {
        type: String,
        required: true
    },
    ingredient_measurement: String
})

const IngredienModel = mongoose.model.Ingredient || mongoose.model('Ingredient', IngredientSchema);
module.exports = IngredienModel;