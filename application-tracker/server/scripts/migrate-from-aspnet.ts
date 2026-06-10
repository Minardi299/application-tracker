/**
 * One-time migration: ASP.NET Identity (SQL Server) → BetterAuth + app tables (PostgreSQL).
 *
 * Source tables: AspNetUsers, AspNetUserLogins, ApplicationFolders, JobApplications,
 *                ApplicationFolderJobApplication, TodoItem.
 * Target tables: user, account, application_folders, job_applications,
 *                application_folder_job_application, todo_item.
 *
 * Skips: AspNetRoles/Claims/Tokens/Roles, RefreshTokens — not needed under BetterAuth.
 *
 * GUID handling: SQL Server returns uniqueidentifier values lowercased by tedious.
 * We pass them through as-is, which is what Postgres uuid columns expect.
 *
 * Run:   npm run db:migrate-legacy
 * Reset: pass --reset to truncate target tables first (DESTRUCTIVE).
 */

import "dotenv/config";
import * as mssql from "mssql";
import { sql } from "drizzle-orm";
import { db, pool as pgPool } from "../src/db";
import {
  account,
  applicationFolderJobApplication,
  applicationFolders,
  jobApplications,
  todoItem,
  user,
} from "../src/db/schema";
import { randomUUID } from "crypto";

const RESET = process.argv.includes("--reset");

const sqlServerConfig: mssql.config = {
  server: process.env.LEGACY_DB_SERVER!,
  port: parseInt(process.env.LEGACY_DB_PORT || "1433"),
  database: process.env.LEGACY_DB_NAME!,
  user: process.env.LEGACY_DB_USER,
  password: process.env.LEGACY_DB_PASSWORD,
  options: {
    encrypt: process.env.LEGACY_DB_ENCRYPT === "true",
    trustServerCertificate: process.env.LEGACY_DB_TRUST_SERVER_CERT === "true",
  },
};

interface AspNetUser {
  Id: string;
  Email: string;
  UserName: string | null;
  FirstName: string | null;
  LastName: string | null;
  CreatedAt: Date;
  TotalApplicationCount: number;
  EmailConfirmed: boolean;
}

interface AspNetUserLogin {
  LoginProvider: string;
  ProviderKey: string;
  ProviderDisplayName: string | null;
  UserId: string;
}

interface LegacyFolder {
  Id: string;
  Name: string;
  CreatedAt: Date;
  OwnerId: string;
}

interface LegacyJobApplication {
  Id: string;
  CompanyName: string | null;
  Position: string | null;
  JobPostingUrl: string | null;
  Notes: string | null;
  Status: number;
  CreatedAt: Date;
  UpdatedDate: Date | null;
  OwnerId: string;
}

interface LegacyJunction {
  ApplicationsId: string;
  FoldersId: string;
}

interface LegacyTodo {
  Id: number;
  Name: string | null;
  IsComplete: boolean;
  Description: string | null;
}

async function main() {
  console.log("Connecting to SQL Server…");
  const sqlPool = await new mssql.ConnectionPool(sqlServerConfig).connect();

  try {
    if (RESET) {
      console.log("⚠  --reset: truncating target tables");
      await db.execute(sql`TRUNCATE TABLE
        application_folder_job_application,
        job_applications,
        application_folders,
        todo_item,
        account,
        session,
        "user"
      RESTART IDENTITY CASCADE`);
    }

    const stats = {
      users: 0,
      accounts: 0,
      folders: 0,
      applications: 0,
      junctions: 0,
      todos: 0,
    };

    // ----- Users -----
    console.log("Migrating users…");
    const users = (
      await sqlPool.request().query<AspNetUser>(`
        SELECT Id, Email, UserName, FirstName, LastName, CreatedAt,
               TotalApplicationCount, EmailConfirmed
        FROM AspNetUsers
      `)
    ).recordset;

    if (users.length > 0) {
      await db
        .insert(user)
        .values(
          users.map((u) => ({
            id: u.Id,
            email: u.Email,
            emailVerified: !!u.EmailConfirmed,
            name: u.UserName ?? u.Email,
            firstName: u.FirstName,
            lastName: u.LastName,
            totalApplicationCount: u.TotalApplicationCount,
            createdAt: u.CreatedAt,
            updatedAt: u.CreatedAt,
          })),
        )
        .onConflictDoNothing({ target: user.id });
      stats.users = users.length;
    }

    // ----- Google account links -----
    console.log("Migrating Google account links…");
    const logins = (
      await sqlPool.request().query<AspNetUserLogin>(`
        SELECT LoginProvider, ProviderKey, ProviderDisplayName, UserId
        FROM AspNetUserLogins
        WHERE LoginProvider = 'Google'
      `)
    ).recordset;

    if (logins.length > 0) {
      const now = new Date();
      await db
        .insert(account)
        .values(
          logins.map((l) => ({
            id: randomUUID(),
            userId: l.UserId,
            accountId: l.ProviderKey,
            providerId: "google",
            createdAt: now,
            updatedAt: now,
          })),
        )
        .onConflictDoNothing();
      stats.accounts = logins.length;
    }

    // ----- Folders -----
    console.log("Migrating folders…");
    const folders = (
      await sqlPool.request().query<LegacyFolder>(`
        SELECT Id, Name, CreatedAt, OwnerId FROM ApplicationFolders
      `)
    ).recordset;

    if (folders.length > 0) {
      await db
        .insert(applicationFolders)
        .values(
          folders.map((f) => ({
            id: f.Id,
            name: f.Name,
            createdAt: f.CreatedAt,
            ownerId: f.OwnerId,
          })),
        )
        .onConflictDoNothing({ target: applicationFolders.id });
      stats.folders = folders.length;
    }

    // ----- Job applications -----
    console.log("Migrating job applications…");
    const apps = (
      await sqlPool.request().query<LegacyJobApplication>(`
        SELECT Id, CompanyName, Position, JobPostingUrl, Notes, Status,
               CreatedAt, UpdatedDate, OwnerId
        FROM JobApplications
      `)
    ).recordset;

    if (apps.length > 0) {
      // chunk to keep parameter count under Postgres' limit (~65k)
      const chunkSize = 500;
      for (let i = 0; i < apps.length; i += chunkSize) {
        const slice = apps.slice(i, i + chunkSize);
        await db
          .insert(jobApplications)
          .values(
            slice.map((a) => ({
              id: a.Id,
              companyName: a.CompanyName,
              position: a.Position,
              jobPostingUrl: a.JobPostingUrl,
              notes: a.Notes,
              status: a.Status,
              createdAt: a.CreatedAt,
              updatedAt: a.UpdatedDate,
              ownerId: a.OwnerId,
            })),
          )
          .onConflictDoNothing({ target: jobApplications.id });
      }
      stats.applications = apps.length;
    }

    // ----- Folder ↔ Application junctions -----
    console.log("Migrating folder-application junctions…");
    const junctions = (
      await sqlPool.request().query<LegacyJunction>(`
        SELECT ApplicationsId, FoldersId FROM ApplicationFolderJobApplication
      `)
    ).recordset;

    if (junctions.length > 0) {
      const chunkSize = 1000;
      for (let i = 0; i < junctions.length; i += chunkSize) {
        const slice = junctions.slice(i, i + chunkSize);
        await db
          .insert(applicationFolderJobApplication)
          .values(
            slice.map((j) => ({
              applicationId: j.ApplicationsId,
              folderId: j.FoldersId,
            })),
          )
          .onConflictDoNothing();
      }
      stats.junctions = junctions.length;
    }

    // ----- Todo items -----
    console.log("Migrating todo items…");
    const todos = (
      await sqlPool.request().query<LegacyTodo>(`
        SELECT Id, Name, IsComplete, Description FROM TodoItem
      `)
    ).recordset;

    if (todos.length > 0) {
      await db
        .insert(todoItem)
        .values(
          todos.map((t) => ({
            id: t.Id,
            name: t.Name,
            isComplete: !!t.IsComplete,
            description: t.Description,
          })),
        )
        .onConflictDoNothing({ target: todoItem.id });

      // bigserial sequences don't auto-advance after explicit ID inserts
      await db.execute(sql`
        SELECT setval(
          pg_get_serial_sequence('todo_item', 'id'),
          COALESCE((SELECT MAX(id) FROM todo_item), 1)
        )
      `);
      stats.todos = todos.length;
    }

    console.log("\nMigration complete:");
    console.table(stats);
  } finally {
    await sqlPool.close();
    await pgPool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
