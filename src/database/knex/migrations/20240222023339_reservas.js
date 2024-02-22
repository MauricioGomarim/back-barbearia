exports.up = knex => knex.schema.createTable("reservas", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users");
    table.integer("id_barbeiro");
    table.text("services");
    table.date("dia");
    table.time("hora");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("reservas");