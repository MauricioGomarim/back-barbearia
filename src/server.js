require("express-async-errors");

const AppError = require("./utils/AppError");
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const app = express();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./sessao-wpp/session",
  }),
});

app.use(cors());
app.use(express.json());

app.use(routes);

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});




client.on("authenticated", (session) => {
  console.log("Autenticado com sucesso!");
});

client.on("message", async (message) => {
  if (message.body === "!ping") {
    await client.sendMessage(message.from, "pong");
  }
});

function enviarMensagem(numero, mensagem) {
    const numeroFormatado = numero + "@c.us";
  client
    .sendMessage(numeroFormatado, mensagem)
    .then((response) => {
      console.log("Mensagem enviada com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao enviar mensagem:", error);
    });
}

client.initialize();

app.use((error, request, response, next) => {
  // Client error
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  // Server error
  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// Running port
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
