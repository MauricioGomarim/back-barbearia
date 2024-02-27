exports.up = knex => knex.schema.createTable("servicos", table => {
    table.increments("id");
    table.integer("barbeiro_id").references("id").inTable("users").onDelete('CASCADE');
    table.text("title");
    table.text("stars");
    table.text("duracao");
    table.text("valor");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("servicos");