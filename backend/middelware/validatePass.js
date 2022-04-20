// Importation du package de validation de password
const passValidator = require("password-validator")

// Creation de schema de mot de passe
const passSchema = new passValidator()

// les critéres à respecter dans un mot de passe
passSchema
.is().min(8)                                    
.is().max(20)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(1)                                // un chiffre minimum
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

// fonction de verification du mot de passe
module.exports = (req, res, next) => {
    if(!passSchema.validate(req.body.password)) {
        res.status(401).json({error: "le mot de passe doit contenir au moins 8 carractére et au max 20 avec au moins une majuscule et un chiffre !"})
    }
    else {
        next();
    }
  };