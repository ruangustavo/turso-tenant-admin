import { createClient as createLibsqlClient } from "@libsql/client";
import { createClient as createTursoClient } from "@tursodatabase/api";
import { hash } from "bcrypt";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { env } from "../env";

const turso = createTursoClient({
  token: env.TURSO_API_TOKEN,
  org: env.TURSO_ORG,
});

export const checkDatabaseExists = async (tenant: string) => {
  try {
    await turso.databases.get(tenant);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createDatabase = async (tenant: string) => {
  try {
    await turso.databases.create(tenant, {
      group: "default",
    });
    return true;
  } catch (error) {
    console.error("Database creation failed:", error);
    return false;
  }
};

export const runMigrations = async (tenant: string) => {
  try {
    const db = getDatabaseClient(tenant);

    if (!db) {
      return false;
    }

    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  }
};

export const setupTenantDatabase = async (tenant: string): Promise<boolean> => {
  const dbCreated = await createDatabase(tenant);
  if (!dbCreated) return false;

  const migrationsRun = await runMigrations(tenant);
  if (!migrationsRun) {
    return false;
  }

  return true;
};

export const getLibsqlClient = (tenant: string) => {
  const dbName = tenant.toLowerCase();
  const url = `libsql://${dbName}-${env.TURSO_ORG}.aws-us-east-1.turso.io`;
  return createLibsqlClient({
    url,
    authToken: env.TURSO_GROUP_AUTH_TOKEN,
  });
};

export const getDatabaseClient = (tenant?: string) => {
  if (!tenant || typeof tenant !== "string") {
    console.error("Failed to create database client: Invalid tenant.");
    return null;
  }

  const dbName = tenant.toLowerCase();
  const url = `libsql://${dbName}-${env.TURSO_ORG}.aws-us-east-1.turso.io`;

  try {
    const client = createLibsqlClient({
      url,
      authToken: env.TURSO_GROUP_AUTH_TOKEN,
    });

    return drizzle(client);
  } catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
};

interface User {
  username: string;
  password: string;
}

export const runDDL = async (tenant: string) => {
  const client = getLibsqlClient(tenant);
  if (!client) {
    return false;
  }

  const data = await db.select({ ddl: settings.ddl }).from(settings).get();

  if (!data?.ddl) {
    return false;
  }

  await client.execute(data.ddl);
  return true;
};

export const createUsers = async (tenant: string, users: User[]) => {
  const client = getLibsqlClient(tenant);
  if (!client) {
    return false;
  }

  for (const user of users) {
    const hashedPassword = await hash(user.password, 10);

    await client.execute({
      sql: "INSERT INTO users (username, password) VALUES (?, ?)",
      args: [user.username, hashedPassword],
    });
  }

  return true;
};
