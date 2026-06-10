import { Router } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import {
  applicationFolders,
  applicationFolderJobApplication,
} from "../db/schema";
import { requireAuth } from "../middleware/require-auth";
import type { FolderDTO } from "../types";

const router = Router();

router.use(requireAuth);

async function getFolderDTO(id: string, ownerId: string): Promise<FolderDTO | null> {
  const rows = await db
    .select({
      id: applicationFolders.id,
      name: applicationFolders.name,
      createdAt: applicationFolders.createdAt,
      ownerId: applicationFolders.ownerId,
      applicationCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${applicationFolderJobApplication}
        WHERE ${applicationFolderJobApplication.folderId} = ${applicationFolders.id}
      )`,
    })
    .from(applicationFolders)
    .where(and(eq(applicationFolders.id, id), eq(applicationFolders.ownerId, ownerId)))
    .limit(1);
  return rows[0] ?? null;
}

router.get("/", async (req, res, next) => {
  try {
    const rows = await db
      .select({
        id: applicationFolders.id,
        name: applicationFolders.name,
        createdAt: applicationFolders.createdAt,
        ownerId: applicationFolders.ownerId,
        applicationCount: sql<number>`(
          SELECT COUNT(*)::int FROM ${applicationFolderJobApplication}
          WHERE ${applicationFolderJobApplication.folderId} = ${applicationFolders.id}
        )`,
      })
      .from(applicationFolders)
      .where(eq(applicationFolders.ownerId, req.user!.id));
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const dto = await getFolderDTO(req.params.id, req.user!.id);
    if (!dto) return res.status(404).json({ error: "Folder not found" });
    res.json(dto);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body as { name?: string };
    if (!name) return res.status(400).json({ error: "Name required" });
    const [row] = await db
      .insert(applicationFolders)
      .values({ name, ownerId: req.user!.id })
      .returning();
    const dto: FolderDTO = { ...row, applicationCount: 0 };
    res.status(201).json(dto);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name?: string };
    if (!name) return res.status(400).json({ error: "Name required" });
    const result = await db
      .update(applicationFolders)
      .set({ name })
      .where(and(eq(applicationFolders.id, id), eq(applicationFolders.ownerId, req.user!.id)))
      .returning();
    if (result.length === 0) return res.status(404).json({ error: "Folder not found" });
    const dto = await getFolderDTO(id, req.user!.id);
    res.json(dto);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.transaction(async (tx) => {
      const owned = await tx
        .select({ id: applicationFolders.id })
        .from(applicationFolders)
        .where(and(eq(applicationFolders.id, id), eq(applicationFolders.ownerId, req.user!.id)))
        .limit(1);
      if (owned.length === 0) {
        res.status(404).json({ error: "Folder not found" });
        return;
      }
      await tx
        .delete(applicationFolderJobApplication)
        .where(eq(applicationFolderJobApplication.folderId, id));
      await tx.delete(applicationFolders).where(eq(applicationFolders.id, id));
    });
    if (!res.headersSent) res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
