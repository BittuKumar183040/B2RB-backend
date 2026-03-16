exports.up = function (knex) {
  return knex.schema
    .createTable("cred", (table) => {
      table.string("email").primary();
      table.string("password");
    })
    .then(() => {
      return knex.schema.createTable("user", (table) => {
        table.string("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("email").notNullable().unique().index().references("email").inTable("cred").onDelete("CASCADE");
        table.string("name", 255).notNullable();
        table.string("picture", 255);
        table.integer("createdAt").notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
        table.integer("updatedAt").notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("user")
    .dropTableIfExists("cred");
};
