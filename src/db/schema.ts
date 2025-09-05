import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenants = sqliteTable("tenants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
});

export const settings = sqliteTable("settings", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ddl: text("ddl"),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username"),
  password: text("password"),
});

export const tenantUsers = sqliteTable("tenant_users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username"),
  password: text("password"),
  tenantId: integer("tenant_id", { mode: "number" })
    .references(() => tenants.id)
    .notNull(),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(tenantUsers),
}));

export const usersRelations = relations(tenantUsers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantUsers.tenantId],
    references: [tenants.id],
  }),
}));
