exports.up = knex => knex.schema.createTable("reservas", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users");
    table.integer("id_barbeiro_select").references("id").inTable("users");
    table.text("id_services");
    table.text("data_hora_reserva");

    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("reservas");