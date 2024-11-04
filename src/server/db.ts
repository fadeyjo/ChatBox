import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE,
});

export default pool;
