import { Router } from "express";
import { eq, gt, sql } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { requireAuth } from "../middleware/require-auth";
import type { ApplicationUserDTO } from "../types";

const router = Router();

router.use(requireAuth);

function toDTO(row: typeof user.$inferSelect): ApplicationUserDTO {
  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    profilePictureUrl: row.image,
    totalApplicationCount: row.totalApplicationCount,
    createdAt: row.createdAt,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const rows = await db.select().from(user).where(eq(user.id, req.user!.id)).limit(1);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(toDTO(rows[0]));
  } catch (err) {
    next(err);
  }
});

router.get("/rank", async (req, res, next) => {
  try {
    const me = await db
      .select({ count: user.totalApplicationCount })
      .from(user)
      .where(eq(user.id, req.user!.id))
      .limit(1);
    if (me.length === 0) return res.status(404).json({ error: "User not found" });

    const ahead = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(user)
      .where(gt(user.totalApplicationCount, me[0].count));

    res.json(ahead[0].n + 1);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ error: "Email required" });
    await db.update(user).set({ email, updatedAt: new Date() }).where(eq(user.id, id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    await db.delete(user).where(eq(user.id, id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
