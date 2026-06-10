import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { todoItem } from "../db/schema";
import type { TodoItemDTO } from "../types";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.select().from(todoItem);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const body = req.body as Partial<TodoItemDTO>;
    await db
      .update(todoItem)
      .set({
        ...(body.name !== undefined && { name: body.name }),
        ...(body.isComplete !== undefined && { isComplete: body.isComplete }),
        ...(body.description !== undefined && { description: body.description }),
      })
      .where(eq(todoItem.id, id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
