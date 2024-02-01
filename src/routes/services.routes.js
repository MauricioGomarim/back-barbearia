const { Router  } = require('express');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthenticatedBarbeiro = require("../middlewares/ensureAuthenticatedBarbeiro")

const ServicesController = require("../controllers/ServicesController")
const servicesController = new ServicesController();



const servicesRoutes = Router();

servicesRoutes.post('/:user_id', ensureAuthenticated, ensureAuthenticatedBarbeiro, servicesController.create);


module.exports = servicesRoutes;
