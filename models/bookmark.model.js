const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.user_id, ref: 'User'
    },    
    recipe_id: [
        { type: mongoose.Schema.Types.recipe_id, ref: 'Recipe'}
    ],
})

const BookmarkModel = mongoose.model.Bookmarks || mongoose.model('Bookmark', BookmarkSchema);
module.exports = BookmarkModel;