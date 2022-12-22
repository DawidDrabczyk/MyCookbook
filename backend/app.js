const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

mongoose
  .connect('mongodb+srv://Dave:Angularbos734@meanapp.uya4l5f.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection to database failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.post('/api/recipes', (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    content: req.body.content,
  });
  recipe.save().then((createdRecipe) => {
    res.status(201).json({
      message: 'Recipe added successfully!',
      recipeId: createdRecipe._id
    });
  });
});

app.get('/api/recipes', (req, res, next) => {
  Recipe.find().then((docs) => {
    res.status(200).json({
      message: 'Recipes fetched successfully!',
      recipes: docs,
    });
  });
});

app.delete('/api/recipes:id', (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Recipe deleted!',
    });
  });
});

module.exports = app;
