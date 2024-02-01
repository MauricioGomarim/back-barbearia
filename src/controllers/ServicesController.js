const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");

const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class ServicesController {
  async create(request, response) {
    const { title, stars, duracao, valor } = request.body;

    const { user_id } = request.params;


    try {
      await knex("servicos").insert({
        user_id,
        title,
        stars,
        duracao,
        valor,
      });

    } catch {
      throw new AppError("Erro ao cadastrar serviço!", 500);
    }

    return response.json();
  }
}

module.exports = ServicesController;
