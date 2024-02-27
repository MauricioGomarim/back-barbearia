const { Router  } = require('express');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthenticatedBarbeiro = require("../middlewares/ensureAuthenticatedBarbeiro")

const ReservasController = require("../controllers/ReservasController")
const reservasController = new ReservasController();



const reservasRoutes = Router();

reservasRoutes.post('/', ensureAuthenticated , reservasController.create);
reservasRoutes.get('/search', ensureAuthenticated , reservasController.showFilter);







module.exports = reservasRoutes;
