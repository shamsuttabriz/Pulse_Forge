import express, { type Request, type Response } from "express";
import { Pool } from "pg";

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_Fnj89PkvLWsr@ep-blue-scene-aok1kgi0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,

            name VARCHAR(25),
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    console.log("Database initialized successfully.");
  } catch (err) {
    console.log(err);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

export default app;
