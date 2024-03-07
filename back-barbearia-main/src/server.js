
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const AppError = require("./utils/AppError");
const routes = require("./routes/index");

class Server {
  constructor() {
    this.app = express();
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: "./sessao-wpp/session",
      }),
    });

    this.initialize();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  initialize() {
    this.client.initialize();
    this.client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on("authenticated", (session) => {
      console.log("Autenticado com sucesso!");
    });
    this.client.on("ready", () => {
      console.log("Client is ready!");
    });
    this.client.on("message", async (message) => {
      if (message.body === "!ping") {
        await this.client.sendMessage(message.from, "pong");
      }
    });
  }

  setupMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      req.whatsapp = this.client;
      next();
    });
  }

  setupRoutes() {
    this.app.use(routes);
    this.app.use((error, req, res, next) => {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    });
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Server is running on Port ${port}`);
    });
  }

}

module.exports = Server;