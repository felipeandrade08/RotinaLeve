import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { pool } from "../db/pool.js";

const prioritySchema = z.enum(["low", "medium", "high"]);
const categorySchema = z.enum(["Trabalho", "Financeiro", "Pessoal", "Saúde", "Outros"]);

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().default(""),
  category: categorySchema.optional().default("Outros"),
  priority: prioritySchema.optional().default("medium"),
  due_date: z.string().date().nullable().optional(),
});

const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

type AuthUser = { sub: string; email: string };
const userId = (request: { user: unknown }) => (request.user as AuthUser).sub;

const taskColumns = "id,title,description,category,completed,priority,due_date,created_at,updated_at";

export async function tasksRoutes(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: "Não autenticado" });
    }
  });

  app.get("/", async (request) => {
    const result = await pool.query(
      `SELECT ${taskColumns}
       FROM tasks
       WHERE user_id=$1
       ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC`,
      [userId(request)],
    );
    return { tasks: result.rows };
  });

  app.post("/", async (request, reply) => {
    const parsed = createTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "Dados inválidos",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { title, description, category, priority, due_date } = parsed.data;
    const result = await pool.query(
      `INSERT INTO tasks(user_id,title,description,category,priority,due_date)
       VALUES($1,$2,$3,$4,$5,$6)
       RETURNING ${taskColumns}`,
      [userId(request), title, description, category, priority, due_date ?? null],
    );

    return reply.code(201).send({ task: result.rows[0] });
  });

  app.patch("/:id", async (request, reply) => {
    const parsed = updateTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "Dados inválidos",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { title, description, category, priority, due_date, completed } = parsed.data;
    const id = (request.params as { id: string }).id;

    const result = await pool.query(
      `UPDATE tasks SET
        title=COALESCE($1,title),
        description=COALESCE($2,description),
        category=COALESCE($3,category),
        priority=COALESCE($4,priority),
        due_date=CASE WHEN $5::boolean THEN $6::date ELSE due_date END,
        completed=COALESCE($7,completed),
        updated_at=NOW()
       WHERE id=$8 AND user_id=$9
       RETURNING ${taskColumns}`,
      [
        title ?? null,
        description ?? null,
        category ?? null,
        priority ?? null,
        due_date !== undefined,
        due_date ?? null,
        completed ?? null,
        id,
        userId(request),
      ],
    );

    if (!result.rowCount) {
      return reply.code(404).send({ error: "Tarefa não encontrada" });
    }

    return { task: result.rows[0] };
  });

  app.delete("/:id", async (request, reply) => {
    const id = (request.params as { id: string }).id;
    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id",
      [id, userId(request)],
    );

    if (!result.rowCount) {
      return reply.code(404).send({ error: "Tarefa não encontrada" });
    }

    return { ok: true };
  });
}
