const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");

const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class ServicesController {
  async create(request, response) {
    const { user_id, title, stars, duracao, valor } = request.body;

    try {
      await knex("servicos").insert({
        barbeiro_id: user_id,
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

  async update(request, response) {
    const { title, stars, duracao, valor } = request.body;

    const servico_id = request.params.id;

    const servico = await knex("servicos").where({ id: servico_id }).first();

    if (!servico) {
      throw new AppError("Serviço não encontrado");
    }

    servico.title = title;
    servico.stars = stars;
    servico.duracao = duracao;
    servico.valor = valor;

    // Inserindo dados no banco
    await knex("servicos").where({ id: servico_id }).update(servico);

    return response.status(201).json();
  }

  async index(request, response) {
    const { title, id } = request.query;
    let services;
 
    if (id) {
      // Se id estiver definido, filtrar por barbeiro_id
      if (title) {
        services = await knex("servicos")
          .where("barbeiro_id", id)
          .whereRaw("LOWER(title) LIKE ?", [`%${title.toLowerCase()}%`])
          .orderBy("id");
      } else {
        services = await knex("servicos")
          .where("barbeiro_id", id)
          .orderBy("created_at", "desc");
      }
    } else {
      // Se id não estiver definido, retornar todos os serviços
      services = await knex("servicos").orderBy("created_at", "desc");
    }

    return response.status(201).json(services);
  }

  async show(request, response) {
    const id = request.params.id;
    const servico = await knex("servicos").where({ id }).first();
    return response.status(201).json(servico);
  }

  async delete(request, response) {
    const id = request.params.id;

    await knex("servicos").where({ id }).delete();
    return response.status(201).json();
  }
}

module.exports = ServicesController;
