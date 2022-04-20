const expressLimit = require("express-rate-limit");

const limitConnexion = expressLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, ///tentatives de connexions autorisées pour chaque IP
	message:
		'Plusieurs tentatives de connexion ont échoué, vous êtes bloquées pendant quelques minutes',
})

module.exports = limitConnexion;
