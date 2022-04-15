const express = require('express');

const saucesCtrl = require('../controllers/sauces');

const router = express.Router();

const auth = require('../middelware/auth');

const multer = require('../middelware/multer-config');

router.get('/', auth, saucesCtrl.getAllSauces);

router.post('/', auth, multer,saucesCtrl.createSauce);

router.get('/:id', auth, multer,saucesCtrl.getOneSauce);

router.put('/:id', auth, multer,saucesCtrl.modifySauce);

router.delete('/:id', auth, saucesCtrl.deleteSauce);

router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce);

module.exports = router;



