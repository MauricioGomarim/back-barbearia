const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const knex = require("../database/knex");




async function ensureAuthenticatedBarbeiro(request, response, next) {
    const authHeader = request.headers.authorization;
  
    const [, token] = authHeader.split(" ");
    
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

  
    const checkUserExists = await knex("users")
    .where({ id: user_id })
    .first();
  
    
    if(checkUserExists.isBarbeiro){
        return next();
    } else {
        throw new AppError("Acesso não permitido!", 401);
    }
  }

module.exports = ensureAuthenticatedBarbeiro;
