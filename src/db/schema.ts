import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenants = sqliteTable("tenants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const settings = sqliteTable("settings", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ddl: text("ddl").notNull(),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const tenantUsers = sqliteTable("tenant_users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  password: text("password").notNull(),
  tenantId: integer("tenant_id", { mode: "number" })
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
});
