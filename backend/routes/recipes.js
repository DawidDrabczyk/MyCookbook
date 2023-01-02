const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const { createRecipe, editRecipe, getRecipes, getSingleRecipe, deleteRecipe } = require('../controllers/recipes');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invalid mime type!');
    if (isValid) {
      err = null;
    }
    cb(err, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.post('', checkAuth, multer({ storage: storage }).single('image'), createRecipe);

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), editRecipe);

router.get('', getRecipes);

router.get('/:id', getSingleRecipe);

router.delete('/:id', checkAuth, deleteRecipe);

module.exports = router;
