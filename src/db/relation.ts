import { relations } from "drizzle-orm";
import { tenants, tenantUsers } from "./schema";

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(tenantUsers),
}));

export const usersRelations = relations(tenantUsers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantUsers.tenantId],
    references: [tenants.id],
  }),
}));
