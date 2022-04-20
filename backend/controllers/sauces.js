const Sauce = require('../models/sauce');

// importation du package file system
const fs = require('fs');

// récuperer toutes les sauces
exports.getAllSauces= (req, res, next) => {
    Sauce.find()
    .then(
      (sauces) => {
        res.status(200).json(sauces);
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    )}

// Ajouter de sauce
exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    const sauce = new Sauce({
      ...saucesObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => res.status(400).json({ error }));
  };

// Consulter une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

// modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })

    // verification que la sauce appartient à l'utulisateur authentifier et qui passe la requette de supprssion
    .then((sauce) => {
        if (!sauce) {
          res.status(404).json({
            error: new Error('No such Thing!')});
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
    // si il est bien verifier on passe à la supprssion
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => {res.status(200).json({message: 'Deleted!'});})
        .catch((error) => {res.status(400).json({error: error});});
      }
    )
  };
// aimer ou pas une sauce 
exports.likeDislikeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;
  
  Sauce.findOne({ _id: sauceId })
  .then(function (sauce) {
    switch (like) {
      //si l'utulisateur aime la sauce et l'userid n'est pas enrejistré dans le tableau usersliked
      case 1:
        if (!sauce.usersLiked.includes(userId) && like == 1) {
          Sauce.updateOne({ _id: sauceId },
            {
              $inc: { likes: 1 }, $push: { usersLiked: userId }
            })
            .then(function () {
              res.status(201).json({ message: "utulisateur aime la sauce!" });
            })
            .catch(function (error) {
              res.status(400).json({ error: error });
            });
        }
        break;
      //si l'utulisateur n'aime pas la sauce et l'userid n'est pas enrejistré dans le tableau usersDisliked
      case -1:
        if (!sauce.usersDisliked.includes(userId) && like == -1) {
          Sauce.updateOne({ _id: sauceId },
            {
              // dislike prend la valeur 1 et user sera ajouter au tableau dislike
              $inc: { dislikes: 1 }, $push: { usersDisliked: userId }, }
          )
            .then(function () {
              res.status(201).json({ message: "utulisateur n'aime pas la sauce!" });
            })
            .catch(function (error) {
              res.status(400).json({ error: error });
            });
        }
        break;
      //utulisateur retire son like
      case 0:
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({ _id: sauceId },
            { 
              // like prend -1 et user sera supprimer du tableau liked
              $inc: { likes: -1 }, $pull: { usersLiked: userId }, }
          )
            .then(function () {
              res.status(201).json({ message: "Le like du sauce a été annulé !" });
            })
            .catch(function (error) {
              res.status(400).json({ error: error });
            });
        }
        //utulisateur retire son dislike 
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              // dislike prend -1 et user sera supprimer du tableau disliked
               $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }, }
          )
            .then(function () {
              res.status(201).json({ message: "Le dislike du sauce a été annulé !" });
            })
            .catch(function (error) {
              res.status(400).json({ error: error });
            });
        }
        break;
    }
  })
  .catch(function (error) {
    res.status(404).json({ error: error });
  });
};