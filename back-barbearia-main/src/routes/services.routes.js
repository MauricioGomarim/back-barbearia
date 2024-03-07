const { Router  } = require('express');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthenticatedBarbeiro = require("../middlewares/ensureAuthenticatedBarbeiro")

const ServicesController = require("../controllers/ServicesController")
const servicesController = new ServicesController();



const servicesRoutes = Router();

servicesRoutes.post('/', ensureAuthenticatedBarbeiro, servicesController.create);
servicesRoutes.get('/', servicesController.index);
servicesRoutes.get('/:id', servicesController.show);
servicesRoutes.put('/:id', ensureAuthenticatedBarbeiro, servicesController.update);
servicesRoutes.delete('/:id', ensureAuthenticatedBarbeiro, servicesController.delete);






module.exports = servicesRoutes;
