import { Pool } from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load the server .env independently of the directory from which Node is started.
// In Railway, DATABASE_URL/JWT_SECRET come from the platform environment and this
// fallback does not interfere with them.
const serverEnvPath = fileURLToPath(new URL("../../.env", import.meta.url));
dotenv.config({ path: serverEnvPath });
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não configurada. Defina DATABASE_URL no ambiente do servidor.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

pool.on("error", (error) => {
  console.error("Erro inesperado no PostgreSQL:", error);
});
