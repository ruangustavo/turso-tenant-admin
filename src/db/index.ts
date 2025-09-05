import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/env";
import type * as schema from "./schema";

export const db = drizzle<typeof schema>({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
