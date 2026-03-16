import knex from "./knex.js";

export async function runMigrations() {
  try {
    console.log("Running database migrations...");
    await knex.migrate.latest();
    console.log("Migrations completed successfully");
  }
  catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}
