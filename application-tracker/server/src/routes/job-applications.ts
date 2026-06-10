import { Router } from "express";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "../db";
import {
  applicationFolders,
  applicationFolderJobApplication,
  jobApplications,
  user,
} from "../db/schema";
import { requireAuth } from "../middleware/require-auth";
import {
  type FolderDTO,
  type JobApplicationDTO,
  statusToInt,
  statusToString,
} from "../types";

const router = Router();

router.use(requireAuth);

async function loadFoldersForApplications(
  applicationIds: string[],
): Promise<Map<string, FolderDTO[]>> {
  if (applicationIds.length === 0) return new Map();
  const rows = await db
    .select({
      applicationId: applicationFolderJobApplication.applicationId,
      id: applicationFolders.id,
      name: applicationFolders.name,
      createdAt: applicationFolders.createdAt,
      ownerId: applicationFolders.ownerId,
    })
    .from(applicationFolderJobApplication)
    .innerJoin(
      applicationFolders,
      eq(applicationFolderJobApplication.folderId, applicationFolders.id),
    )
    .where(
      sql`${applicationFolderJobApplication.applicationId} = ANY(${sql.raw(`ARRAY[${applicationIds.map((id) => `'${id}'::uuid`).join(",")}]`)})`,
    );

  const map = new Map<string, FolderDTO[]>();
  for (const row of rows) {
    const list = map.get(row.applicationId) ?? [];
    list.push({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      ownerId: row.ownerId,
      applicationCount: 0,
    });
    map.set(row.applicationId, list);
  }
  return map;
}

function toDTO(
  row: typeof jobApplications.$inferSelect,
  folders: FolderDTO[] = [],
): JobApplicationDTO {
  return {
    id: row.id,
    companyName: row.companyName,
    position: row.position,
    jobPostingUrl: row.jobPostingUrl,
    notes: row.notes,
    status: statusToString(row.status),
    createdAt: row.createdAt,
    updatedDate: row.updatedAt,
    ownerId: row.ownerId,
    folders,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const apps = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.ownerId, req.user!.id));
    const folderMap = await loadFoldersForApplications(apps.map((a) => a.id));
    res.json(apps.map((a) => toDTO(a, folderMap.get(a.id) ?? [])));
  } catch (err) {
    next(err);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const month = req.query.month as string | undefined;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "month query param required (YYYY-MM)" });
    }
    const [year, mon] = month.split("-").map(Number);
    const start = new Date(Date.UTC(year, mon - 1, 1));
    const end = new Date(Date.UTC(year, mon, 1));

    const rows = await db
      .select({ status: jobApplications.status, count: sql<number>`count(*)::int` })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.ownerId, req.user!.id),
          gte(jobApplications.createdAt, start),
          lt(jobApplications.createdAt, end),
        ),
      )
      .groupBy(jobApplications.status);

    const stats = {
      wishlist: 0,
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0,
    };
    const keys: (keyof typeof stats)[] = [
      "wishlist",
      "applied",
      "interviewing",
      "offered",
      "rejected",
      "accepted",
      "withdrawn",
    ];
    for (const r of rows) {
      const key = keys[r.status];
      if (key) stats[key] = r.count;
    }
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.get("/count", async (req, res, next) => {
  try {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(jobApplications)
      .where(eq(jobApplications.ownerId, req.user!.id));
    res.json(rows[0].n);
  } catch (err) {
    next(err);
  }
});

router.get("/folder/:folderId", async (req, res, next) => {
  try {
    const { folderId } = req.params;
    const apps = await db
      .select({
        id: jobApplications.id,
        companyName: jobApplications.companyName,
        position: jobApplications.position,
        jobPostingUrl: jobApplications.jobPostingUrl,
        notes: jobApplications.notes,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
        ownerId: jobApplications.ownerId,
      })
      .from(applicationFolderJobApplication)
      .innerJoin(
        jobApplications,
        eq(applicationFolderJobApplication.applicationId, jobApplications.id),
      )
      .where(
        and(
          eq(applicationFolderJobApplication.folderId, folderId),
          eq(jobApplications.ownerId, req.user!.id),
        ),
      );

    const folderMap = await loadFoldersForApplications(apps.map((a) => a.id));
    res.json(apps.map((a) => toDTO(a, folderMap.get(a.id) ?? [])));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(jobApplications)
      .where(
        and(eq(jobApplications.id, req.params.id), eq(jobApplications.ownerId, req.user!.id)),
      )
      .limit(1);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    const folderMap = await loadFoldersForApplications([rows[0].id]);
    res.json(toDTO(rows[0], folderMap.get(rows[0].id) ?? []));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body as Partial<JobApplicationDTO>;
    const status = statusToInt(body.status ?? "Wishlist");

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(jobApplications)
        .values({
          companyName: body.companyName ?? null,
          position: body.position ?? null,
          jobPostingUrl: body.jobPostingUrl ?? null,
          notes: body.notes ?? null,
          status,
          ownerId: req.user!.id,
        })
        .returning();

      if (body.folders && body.folders.length > 0) {
        const folderIds = body.folders.map((f) => f.id);
        const owned = await tx
          .select({ id: applicationFolders.id })
          .from(applicationFolders)
          .where(
            and(
              eq(applicationFolders.ownerId, req.user!.id),
              sql`${applicationFolders.id} = ANY(${folderIds})`,
            ),
          );
        if (owned.length > 0) {
          await tx
            .insert(applicationFolderJobApplication)
            .values(owned.map((f) => ({ applicationId: row.id, folderId: f.id })));
        }
      }

      await tx
        .update(user)
        .set({ totalApplicationCount: sql`${user.totalApplicationCount} + 1` })
        .where(eq(user.id, req.user!.id));

      return row;
    });

    const folderMap = await loadFoldersForApplications([created.id]);
    res.status(201).json(toDTO(created, folderMap.get(created.id) ?? []));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<JobApplicationDTO>;
    const status = body.status !== undefined ? statusToInt(body.status) : undefined;

    const updated = await db.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(jobApplications)
        .where(and(eq(jobApplications.id, id), eq(jobApplications.ownerId, req.user!.id)))
        .limit(1);
      if (existing.length === 0) return null;

      const [row] = await tx
        .update(jobApplications)
        .set({
          ...(body.companyName !== undefined && { companyName: body.companyName }),
          ...(body.position !== undefined && { position: body.position }),
          ...(body.jobPostingUrl !== undefined && { jobPostingUrl: body.jobPostingUrl }),
          ...(body.notes !== undefined && { notes: body.notes }),
          ...(status !== undefined && { status }),
          updatedAt: new Date(),
        })
        .where(eq(jobApplications.id, id))
        .returning();

      if (body.folders !== undefined) {
        await tx
          .delete(applicationFolderJobApplication)
          .where(eq(applicationFolderJobApplication.applicationId, id));
        if (body.folders.length > 0) {
          const folderIds = body.folders.map((f) => f.id);
          const owned = await tx
            .select({ id: applicationFolders.id })
            .from(applicationFolders)
            .where(
              and(
                eq(applicationFolders.ownerId, req.user!.id),
                sql`${applicationFolders.id} = ANY(${folderIds})`,
              ),
            );
          if (owned.length > 0) {
            await tx
              .insert(applicationFolderJobApplication)
              .values(owned.map((f) => ({ applicationId: id, folderId: f.id })));
          }
        }
      }

      return row;
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    const folderMap = await loadFoldersForApplications([updated.id]);
    res.json(toDTO(updated, folderMap.get(updated.id) ?? []));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await db.transaction(async (tx) => {
      const existing = await tx
        .select({ id: jobApplications.id })
        .from(jobApplications)
        .where(and(eq(jobApplications.id, id), eq(jobApplications.ownerId, req.user!.id)))
        .limit(1);
      if (existing.length === 0) return false;
      await tx
        .delete(applicationFolderJobApplication)
        .where(eq(applicationFolderJobApplication.applicationId, id));
      await tx.delete(jobApplications).where(eq(jobApplications.id, id));
      return true;
    });
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
