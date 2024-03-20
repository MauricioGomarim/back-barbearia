exports.up = knex => knex.schema.createTable("reservas", table => {
    table.increments("id");
    table.integer("user_id");
    table.integer("id_barbeiro_select")
    table.text("telefone")
    table.text("id_services");
    table.text("dia_reserva");
    table.text("mes_reserva");
    table.text("hora_reserva");
    table.text("ano_reserva");
    table.text("status");
    table.decimal("valor");





    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("reservas");