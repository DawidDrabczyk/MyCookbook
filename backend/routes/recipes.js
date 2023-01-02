const express = require('express');
const checkAuth = require('../middleware/check-auth');
const storage = require('../middleware/storage');
const { createRecipe, editRecipe, getRecipes, getSingleRecipe, deleteRecipe } = require('../controllers/recipes');

const router = express.Router();

router.post('', checkAuth, storage, createRecipe);

router.put('/:id', checkAuth, storage, editRecipe);

router.get('', getRecipes);

router.get('/:id', getSingleRecipe);

router.delete('/:id', checkAuth, deleteRecipe);

module.exports = router;
