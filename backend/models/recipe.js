const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: {type: String, required: true },
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Recipe', recipeSchema);
