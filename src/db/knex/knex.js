import dotenv from "dotenv";
import knex from "knex";
import config from "../../../knexfile.js";

dotenv.config();

const db = knex(config.development);

export default db;
