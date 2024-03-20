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
      diaDaSemana,
      valor
    } = request.body;

    const meses = {
      janeiro: 0,
      fevereiro: 1,
      março: 2,
      abril: 3,
      maio: 4,
      junho: 5,
      julho: 6,
      agosto: 7,
      setembro: 8,
      outubro: 9,
      novembro: 10,
      dezembro: 11
    };

    const user = await knex("users").where({id: user_id}).first();
    const barbeiro = await knex("users").where({id: id_barbeiro_select}).first();

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
    const numeroMes = meses[mes_reserva.toLowerCase()];

    const numeroLimpo = barbeiro.telefone.replace(/[-()\s]/g, "");

//     try {
//       whatsapp.sendMessage(`55${numeroLimpo}` + "@c.us", `Olá ${barbeiro.name}, tudo bem? Uma reserva para o dia  ${dia_reserva}/${numeroMes}/${ano_reserva} ${diaDaSemana} às ${hora_reserva}hrs foi solicitada!
// Nome do cliente: ${user.name}
// Telefone: ${user.telefone}
// Acesse o link para confirmar ou reprovar a reserva!

// http://localhost:5173/solicitacoes-painel 🙅🏻`);

//     } catch (error) {
//       console.log('error: ', error);
//     }
    

    await knex("reservas").insert({
      user_id: user.id,
      id_barbeiro_select: barbeiro.id,
      telefone: user.telefone,
      id_services: id_services_json,
      dia_reserva,
      mes_reserva: numeroMes,
      hora_reserva,
      ano_reserva,
      status: 'Pendente',
      valor
    });


    return response.status(201).json();
  }

  async update(request, response) {
    const { status } = request.body;
    const reserva_id = request.params.id;

    // Inserindo dados no banco
    await knex("reservas").where({ id: reserva_id }).update({status});

    return response.status(201).json();
  }

  async show(request, response) {
    // Pegando o id
    const { user_id } = request.params;

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
    const {status} = request.query;
 
    let reservas;
    if (status) {
      reservas = await knex("reservas")
          .where({ status })
          .innerJoin("users", "reservas.user_id", "users.id")
          .select("reservas.*", "users.name as user_name");
  } else {
      reservas = await knex("reservas")
          .innerJoin("users", "reservas.user_id", "users.id")
          .select("reservas.*", "users.name as user_name");
  }

    return response.status(201).json(reservas);
  }


}

module.exports = ReservasController;
