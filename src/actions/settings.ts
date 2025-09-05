"use server";

import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { settings as settingsTable } from "@/db/schema";
import { actionClient } from "@/lib/actions";

export const getSettings = actionClient.action(async () => {
  const settings = await db.select().from(settingsTable).get();
  if (!settings) return { error: "Settings not found" };
  return { ddl: settings.ddl };
});

export const updateSettings = actionClient
  .inputSchema(
    z.object({
      ddl: z.string(),
    }),
  )
  .action(async ({ parsedInput: { ddl } }) => {
    let settings = await db
      .select({ id: settingsTable.id })
      .from(settingsTable)
      .get();

    if (!settings) {
      const inserted = await db
        .insert(settingsTable)
        .values({ ddl })
        .returning({ id: settingsTable.id })
        .get();
      settings = inserted;
    }

    await db
      .update(settingsTable)
      .set({ ddl })
      .where(eq(settingsTable.id, settings.id))
      .run();
    return { success: "Settings updated successfully" };
  });
