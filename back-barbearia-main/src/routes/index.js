const { Router } = require('express');


const usersRouter = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const servicesRoutes = require("./services.routes");
const reservasRoutes = require("./reservas.routes");




const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);
routes.use("/services", servicesRoutes);
routes.use("/reserva", reservasRoutes);





// Export
module.exports = routes;
