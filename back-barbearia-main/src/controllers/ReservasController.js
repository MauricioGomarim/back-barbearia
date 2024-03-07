const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");


class ReservasController {
  
  async create(request, response) {
    const {
      user_id,
      id_barbeiro_select,
      id_services,
      dia_reserva,
      mes_reserva,
      hora_reserva,
      ano_reserva,
      valor
    } = request.body;

    const reserva = await knex("reservas")
      .where({ dia_reserva })
      .where({ mes_reserva })
      .where({ hora_reserva })
      .first();

    if (reserva) {
      throw new AppError("Já existe uma reserva nessa data...");
    }
    const id_services_json = JSON.stringify(id_services);

    const { whatsapp } = request;

    try {
      whatsapp.sendMessage("5516981630383" + "@c.us", `Mauricio acaba de realizar uma reserva para o dia ${dia_reserva} de ${mes_reserva} para as ${hora_reserva} hrs`);
    } catch (error) {
      console.log('error: ', error);
    }
    

    await knex("reservas").insert({
      user_id,
      id_barbeiro_select,
      id_services: id_services_json,
      dia_reserva,
      mes_reserva,
      hora_reserva,
      ano_reserva,
      status: 'Pendente',
      valor
    });


    return response.status(201).json();
  }

  async update(request, response) {
    const {
      name,
      telefone,
      email,
      password,
      old_password,
      insta,
      face,
      descricao,
    } = request.body;

    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await knex("users").where({ email }).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    if (!email.includes("@", ".") || !email.includes(".")) {
      throw new AppError("Erro: Digite um email válido!");
    }

    user.name = name;
    user.telefone = telefone;
    user.email = email;
    user.insta = insta;
    user.face = face;
    user.descricao = descricao;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    // Inserindo dados no banco
    await knex("users").where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      telefone: user.telefone,
      password: user.password,
      insta: user.insta,
      face: user.face,
      descricao: user.descricao,
    });

    return response.status(201).json();
  }

  async show(request, response) {
    // Pegando o id
    const user_id = request.user.id;

    const reservas = await knex("reservas").where({ user_id });
    return response.status(201).json(reservas);
  }

  async showFilter(request, response) {
    // Pegando o id
    const { mes, dia, ano } = request.query;

    const reserva = await knex("reservas")
      .where("dia_reserva", `${dia}`)
      .where("mes_reserva", `${mes}`)
      .where("ano_reserva", `${ano}`);

    return response.status(201).json(reserva);
  }

  async index(request, response) {
    const reservas = await knex("reservas");
    return response.status(201).json(reservas);
  }
}

module.exports = ReservasController;