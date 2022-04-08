// application express
const express = require('express');

const app = express(); 

const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const cors= require('cors')

//connection de l'api 
mongoose.connect('mongodb+srv://haifaD:Supercode52@clusterproject.2pmx9.mongodb.net/Database?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

    //middelware contenue json

//middelware de configuration de cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/api/sauces', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
    next();
});

app.use(express.json());
app.use(cors());
//configuration de route user
app.use('/api/auth', userRoutes);

module.exports = app;