import { db } from "@/db";
import { tenants, users } from "@/db/schema";

export interface CreateTenantData {
  name: string;
  users: {
    username: string;
    password: string;
  }[];
}

export async function createTenant(data: CreateTenantData) {
  try {
    // Create tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        name: data.name,
      })
      .returning();

    // Create users for the tenant
    const userData = data.users.map((user) => ({
      username: user.username,
      password: user.password,
      tenantId: tenant.id,
    }));

    const createdUsers = await db.insert(users).values(userData).returning();

    return {
      tenant,
      users: createdUsers,
    };
  } catch (error) {
    console.error("Error creating tenant:", error);
    throw new Error("Failed to create tenant");
  }
}

export async function getTenants() {
  try {
    const result = await db.query.tenants.findMany({
      with: {
        users: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    throw new Error("Failed to fetch tenants");
  }
}
