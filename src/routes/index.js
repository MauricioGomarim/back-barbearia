const { Router } = require('express');


const usersRouter = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");


const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);


// Export
module.exports = routes;
