import z from "zod/v4";

const envSchema = z.object({
  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  TURSO_ORG: z.string(),
  TURSO_API_TOKEN: z.string(),
  TURSO_GROUP_AUTH_TOKEN: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid environment variables", parsedEnv.error);
  process.exit(1);
}

export const env = parsedEnv.data;
