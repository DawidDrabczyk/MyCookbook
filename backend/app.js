const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.post('/api/recipes', (req, res, next) => {
  const recipe = req.body;
  console.log(recipe);
  res.status(201).json({
    message: 'Recipe added successfully!',
  });
});

app.get('/api/recipes', (req, res, next) => {
  const recipes = [
    {
      id: 'dfasdasdas',
      title: 'First server side recipe',
      content: 'This is coming from the server',
    },
    {
      id: 'dfasdasdasdas',
      title: 'Second server side recipe',
      content: 'This is coming from the server!',
    },
  ];
  res.status(200).json({
    message: 'Recipes fetched successfully!',
    recipes: recipes,
  });
});

module.exports = app;
