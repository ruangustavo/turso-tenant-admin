"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { settings as settingsTable } from "@/db/schema";
import { actionClient } from "@/lib/actions";

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
      const createdSettings = await db
        .insert(settingsTable)
        .values({ ddl })
        .returning({ id: settingsTable.id })
        .get();
      settings = createdSettings;
    }

    await db
      .update(settingsTable)
      .set({ ddl })
      .where(eq(settingsTable.id, settings.id))
      .run();

    revalidateTag("settings");
    return { success: "Settings updated successfully" };
  });
