// application express
const express = require('express');

const app = express(); 

const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const path = require('path');

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

app.use(express.json());
app.use(cors());
//configuration de route user
app.use('/api/auth', userRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));

//configuration de route sauces
app.use('/api/sauces', saucesRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;