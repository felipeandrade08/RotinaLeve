import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { pool } from "./db/pool.js";
import { authRoutes } from "./auth/auth.routes.js";
import { tasksRoutes } from "./tasks/tasks.routes.js";

dotenv.config();
const app = Fastify({ logger: true });
const port = Number(process.env.PORT || 3001);

await app.register(cors, { origin: true });
await app.register(sensible);
await app.register(jwt, { secret: process.env.JWT_SECRET || "change-me-in-railway" });
await app.register(authRoutes, { prefix: "/api/v1/auth" });
await app.register(tasksRoutes, { prefix: "/api/v1/tasks" });

app.get("/health", async () => {
  await pool.query("SELECT 1");
  return { ok: true, service: "rotinaleve-api", version: "0.2.0", database: true };
});
app.get("/api/v1/status", async () => ({ ok: true, message: "RotinaLeve API online" }));
app.addHook("onClose", async () => { await pool.end(); });
await app.listen({ port, host: "0.0.0.0" });
