//importation mongoose
const mongoose = require('mongoose');

//importation du package de validation d'email unique
const uniqueValidator = require('mongoose-unique-validator');

//creation de schema user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);                                     //application du plugin validateur

//exporation du modéle user
module.exports = mongoose.model('User', userSchema);