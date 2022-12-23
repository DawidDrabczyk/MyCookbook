const express = require('express');
const multer = require('multer');
const Recipe = require('../models/recipe');

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

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const recipe = new Recipe({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images" + req.file.filename
  });
  recipe.save().then((createdRecipe) => {
    res.status(201).json({
      message: 'Recipe added successfully!',
      recipe: {
        ...createdRecipe,
        id: createdRecipe._id
      }
    });
  });
});

router.put('/:id', (req, res, next) => {
  const recipe = new Recipe({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Recipe.updateOne({ _id: req.params.id }, recipe).then((result) => {
    res.status(200).json({
      message: 'Update successful!',
    });
  });
});

router.get('', (req, res, next) => {
  Recipe.find().then((docs) => {
    res.status(200).json({
      message: 'Recipes fetched successfully!',
      recipes: docs,
    });
  });
});

router.get('/:id', (req, res, next) => {
  Recipe.findById(req.params.id).then((recipe) => {
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({
        message: 'Recipe not found!',
      });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Recipe deleted!',
    });
  });
});

module.exports = router;
