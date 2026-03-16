import { env } from "../env.js";
import pool from "./index.js";

export async function testDbConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected at:", res.rows[0].now);
  }
  catch (err) {
    console.info("PORT", env.PORT);
    console.info("DB_HOST", env.DB_HOST);
    console.info("DB_PORT", env.DB_PORT);
    console.info("DB_NAME", env.DB_NAME);
    console.info("DB_USER", env.DB_USER);
    console.info("DB_PASSWORD", env.DB_PASSWORD);
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}
