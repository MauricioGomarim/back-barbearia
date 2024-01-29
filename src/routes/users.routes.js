const { Router  } = require('express');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const UsersController = require("../controllers/UsersController")
const usersController = new UsersController();



const usersRoutes = Router();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/:id', ensureAuthenticated, usersController.update)
usersRoutes.get('/:id', ensureAuthenticated, usersController.show)
usersRoutes.get('/', ensureAuthenticated, usersController.index)



module.exports = usersRoutes;
