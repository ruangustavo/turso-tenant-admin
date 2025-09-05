"use server";

import { createTenantSchema } from "@/app/(home)/utils/schema";
import { actionClient } from "@/lib/actions";
import {
  checkDatabaseExists,
  createDatabase,
  createUsers,
  runDDL,
} from "@/lib/tenant";

export const createTenant = actionClient
  .inputSchema(createTenantSchema)
  .action(async ({ parsedInput: { name: tenant, users } }) => {
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

    return { success: "Tenant created successfully" };
  });
