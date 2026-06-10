import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
  bigserial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// BetterAuth tables
// ============================================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name").notNull(),
  image: text("image"),

  firstName: text("first_name"),
  lastName: text("last_name"),
  totalApplicationCount: integer("total_application_count").notNull().default(3),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// App tables
// ============================================================================

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: text("company_name"),
  position: text("position"),
  jobPostingUrl: text("job_posting_url"),
  notes: text("notes"),
  status: integer("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const applicationFolders = pgTable("application_folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const applicationFolderJobApplication = pgTable(
  "application_folder_job_application",
  {
    applicationId: uuid("application_id")
      .notNull()
      .references(() => jobApplications.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id")
      .notNull()
      .references(() => applicationFolders.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.applicationId, t.folderId] }),
  }),
);

export const todoItem = pgTable("todo_item", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name"),
  isComplete: boolean("is_complete").notNull().default(false),
  description: text("description"),
});

// ============================================================================
// Relations
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
  applications: many(jobApplications),
  folders: many(applicationFolders),
  sessions: many(session),
  accounts: many(account),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one, many }) => ({
  owner: one(user, { fields: [jobApplications.ownerId], references: [user.id] }),
  folderLinks: many(applicationFolderJobApplication),
}));

export const applicationFoldersRelations = relations(applicationFolders, ({ one, many }) => ({
  owner: one(user, { fields: [applicationFolders.ownerId], references: [user.id] }),
  applicationLinks: many(applicationFolderJobApplication),
}));

export const applicationFolderJobApplicationRelations = relations(
  applicationFolderJobApplication,
  ({ one }) => ({
    application: one(jobApplications, {
      fields: [applicationFolderJobApplication.applicationId],
      references: [jobApplications.id],
    }),
    folder: one(applicationFolders, {
      fields: [applicationFolderJobApplication.folderId],
      references: [applicationFolders.id],
    }),
  }),
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));
