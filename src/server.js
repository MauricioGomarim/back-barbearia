
require("express-async-errors");
const qrcode = require('qrcode-terminal');
const express = require("express")
const http = require("http");
const socketIO = require("socket.io");

const cors = require("cors");
const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require('qrcode');
const AppError = require("./utils/AppError");
const routes = require("./routes/index");

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server, {
      cors: {
        origin: "http://localhost:5173", // Substitua pela origem do seu frontend
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
    });
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: "./sessao-wpp/session",
      })

    });


    this.setupMiddlewares();
    this.initialize();
    this.setupRoutes();
  }

  initialize() {

    
    let latestQRCode = null;
    let isDeviceAuthenticated = false;

    this.client.initialize();
    
    this.io.emit("qr_code", { qrCode: latestQRCode });

    this.io.on('connection', (socket) => {
      console.log('usuário conectado', socket.id);
      if(isDeviceAuthenticated == true) {
        this.io.emit("qr_code", { qrCode: 'autenticado' }); 
      } else {
        this.io.emit("qr_code", { qrCode: latestQRCode }); 
      }

    })

    this.client.on("qr", (qr) => {
      latestQRCode = qr;
      this.io.emit("qr_code", { qrCode: qr });
    });


    this.client.on("disconnected", () => {
      console.log("Cliente desconectado!");
      isDeviceAuthenticated = false;

      this.io.emit("qr_code", { qrCode: null });
      this.client.initialize();
    });


    this.client.on("authenticated", (session) => {
      console.log("Autenticado com sucesso!");
  
    });
    this.client.on("ready", () => {
      console.log("Client is ready!");
      isDeviceAuthenticated = true;
      this.io.emit("qr_code", { qrCode: 'autenticado' });
    });



    //   this.app.get("/qrcode", async (req, res) => {
    //   if (latestQRCode && !isDeviceAuthenticated) {
    //     qrcode.generate(latestQRCode, { small: true });
    //     res.status(200).json({
    //       qrCode: latestQRCode,
    //     });
    //   } 
    //   if (isDeviceAuthenticated) {
    //     res.json({
    //       qrCode: "autenticado",
    //     });
    //   }
    //   if(!latestQRCode) {
    //     res.json({
    //       qrCode: "gerando",
    //     });
    //   }
    // });
  }

  setupMiddlewares() {
    this.app.use(cors({
      origin: '*'
    }));
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
    this.server.listen(port, () => {
      console.log(`Server is running on Port ${port}`);
    });
  }



}

module.exports = Server;