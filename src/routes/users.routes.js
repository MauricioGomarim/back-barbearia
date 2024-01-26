const { Router  } = require('express');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const UsersController = require("../controllers/UsersController")
const usersController = new UsersController();



const usersRoutes = Router();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/', ensureAuthenticated, usersController.update)

module.exports = usersRoutes;
