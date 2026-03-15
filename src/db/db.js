const { Pool } = require("pg");

const pool = new Pool({
  user: "your_postgres_username", // Replace with your username
  host: "localhost", // Replace with your host (e.g., localhost)
  database: "your_database_name", // Replace with your database name
  password: "your_postgres_password", // Replace with your password
  port: 5432, // Default PostgreSQL port
});

// Optional: Log connection success
pool.connect()
  .then(() => console.info("Database connected successfully"))
  .catch(err => console.error("Database connection error", err.stack));

module.exports = pool; // Export the pool for use in other files
