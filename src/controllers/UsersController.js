const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, telefone, password } = request.body;

    console.log("criou")
    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Erro: Este email já está em uso!");
    }

    if (!email.includes("@", ".") || !email.includes(".")) {
      throw new AppError("Erro: Digite um email válido!");
    }

    // Criptografando a senha
    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      telefone,
      password: hashedPassword,
    });

    return response.status(201).json({name, email, telefone, password});
  }

  async update(request, response) {
    const { email, telefone, password, old_password } = request.body;
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

    user.email = email;
    user.telefone = telefone;

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
    await knex("users").where({ id: user_id }).update({name: user.name, email: user.email, telefone: user.telefone, password: user.password})

    return response.status(201).json();
  }

  async show(request, response) {
    // Pegando o id

    const user_id = request.user.id;
   

    const user = await knex("users").where({ id: user_id }).first();
    return response.status(201).json(user);
  }

  async index(request, response) {

    const user = await knex("users");
    return response.status(201).json(user);
  }

}


module.exports = UsersController;
