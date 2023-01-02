const Recipe = require('../models/recipe');

exports.createRecipe = (req, res, next) => {
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
}

exports.editRecipe = (req, res, next) => {
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
}

exports.getRecipes = (req, res, next) => {
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
}

exports.getSingleRecipe = (req, res, next) => {
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
}

exports.deleteRecipe = (req, res, next) => {
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
}
