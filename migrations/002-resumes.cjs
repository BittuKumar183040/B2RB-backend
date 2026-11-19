exports.up = function (knex) {
  return knex.schema.createTable("resumes", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("user_email").notNullable().references("email").inTable("user").onDelete("CASCADE").index();
    table.string("title", 160).notNullable().defaultTo("Untitled resume");
    table.string("template", 80).notNullable().defaultTo("minimal");
    table.jsonb("content").notNullable();
    table.integer("created_at").notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
    table.integer("updated_at").notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("resumes");
};
