const express = require('express');
const multer = require('multer');
const Recipe = require('../models/recipe');
const checkAuth = require('../middleware/check-auth');

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

router.post('', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const recipe = new Recipe({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    author: req.userData.userId,
  });
  recipe
    .save()
    .then((createdRecipe) => {
      res.status(201).json({
        message: 'Recipe added successfully!',
        recipe: {
          ...createdRecipe,
          id: createdRecipe._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Dodanie przepisu nie powiodło się!',
      });
    });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const recipe = new Recipe({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    author: req.userData.userId,
  });
  Recipe.updateOne({ _id: req.params.id, author: req.userData.userId }, recipe)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: 'Update successful!',
        });
      } else {
        res.status(401).json({
          message: 'Not auhorized!',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Edycja nie powiodła się!',
      });
    });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const recipeQuery = Recipe.find();
  let fetchedRecipes;
  if (pageSize && currentPage) {
    recipeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  recipeQuery
    .then((docs) => {
      fetchedRecipes = docs;
      return Recipe.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Recipes fetched successfully!',
        recipes: fetchedRecipes,
        maxRecipes: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Pobranie danych nie powiodło się!',
      });
    });
});

router.get('/:id', (req, res, next) => {
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({
          message: 'Recipe not found!',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Pobranie danych nie powiodło się!',
      });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id, author: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: 'Post deleted!',
        });
      } else {
        res.status(401).json({
          message: 'Not auhorized!',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Usunięcię danych nie powiodło się!',
      });
    });
});

module.exports = router;
