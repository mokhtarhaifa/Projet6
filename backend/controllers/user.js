const bcrypt= require('bcrypt')

const User= require('../models/user')

//package token
const jwt = require('jsonwebtoken');

//fonction signup
exports.signup = (req, res, next) => {
   
    bcrypt.hash(req.body.password, 10)              
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash                            //hashage de mot de passe
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

//fonction login
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })                 //verification d'email
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)        // comparer les mots de passe entrée et enrejistré
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              //creation de token 
              token: jwt.sign(              
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };