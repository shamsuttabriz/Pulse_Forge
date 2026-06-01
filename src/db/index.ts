import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,

            name VARCHAR(25),
            email VARCHAR(25) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'contributor',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,

        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
        status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id INTEGER NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      `);
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

export { pool, initDB };
