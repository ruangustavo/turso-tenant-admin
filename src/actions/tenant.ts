"use server";

import { hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod/v4";
import { createTenantSchema } from "@/app/(home)/utils/schema";
import { db } from "@/db";
import { tenants, tenantUsers } from "@/db/schema";
import { actionClient } from "@/lib/actions";
import {
  checkDatabaseExists,
  createDatabase,
  createUsers,
  deleteDatabase,
  runDDL,
} from "@/lib/tenant";

export const createTenant = actionClient
  .inputSchema(createTenantSchema)
  .action(
    async ({
      parsedInput: { name: tenant, displayName, logoUrl, primaryColor, users },
    }) => {
      const tenantExists = await checkDatabaseExists(tenant);
      if (tenantExists) {
        return { error: "Database already exists" };
      }

      const isDatabaseCreated = await createDatabase(tenant);
      if (!isDatabaseCreated) {
        return { error: "Failed to create database" };
      }

      const isDDLRun = await runDDL(tenant);
      if (!isDDLRun) {
        return { error: "Failed to run DDL" };
      }

      const isUsersCreated = await createUsers(tenant, users);
      if (!isUsersCreated) {
        return { error: "Failed to create users" };
      }

      const [createdTenant] = await db
        .insert(tenants)
        .values({
          name: tenant,
          displayName: displayName || null,
          logoUrl: logoUrl || null,
          primaryColor: primaryColor || null,
        })
        .returning();
      if (!createdTenant) {
        return { error: "Failed to create tenant" };
      }

      const usersToCreate = [];

      for (const user of users) {
        const hashedPassword = await hash(user.password, 10);

        usersToCreate.push({
          username: user.username,
          password: hashedPassword,
          tenantId: createdTenant.id,
        });
      }

      const createdUsers = await db.insert(tenantUsers).values(usersToCreate);
      if (!createdUsers) {
        return { error: "Failed to create users" };
      }

      revalidateTag("tenant");
      return { success: "Tenant created successfully" };
    },
  );

export const deleteTenant = actionClient
  .inputSchema(
    z.object({
      id: z.number(),
    }),
  )
  .action(async ({ parsedInput: { id } }) => {
    const tenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, id))
      .get();

    if (!tenant) {
      return { error: "Tenant not found" };
    }

    await db.delete(tenantUsers).where(eq(tenantUsers.tenantId, id));

    await db.delete(tenants).where(eq(tenants.id, id));

    const isDatabaseDeleted = await deleteDatabase(tenant.name);
    if (!isDatabaseDeleted) {
      return { error: "Failed to delete database" };
    }

    revalidateTag("tenant");
    return { success: "Tenant and database deleted successfully" };
  });
