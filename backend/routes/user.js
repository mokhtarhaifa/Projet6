const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const validMail = require('../middelware/validateMail');
const validPwd = require('../middelware/validatePass');
const connexion = require('../middelware/limitConnexion');

router.post('/signup',validMail,validPwd, userCtrl.signup);
router.post('/login',validMail, connexion, userCtrl.login);

module.exports = router;