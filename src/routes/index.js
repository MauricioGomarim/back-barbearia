const { Router } = require('express');


const usersRouter = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const servicesRoutes = require("./services.routes");



const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);
routes.use("/services", servicesRoutes);




// Export
module.exports = routes;
