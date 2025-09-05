import { ArrowLeft } from "lucide-react";
import { unstable_cache as cache } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db";
import { settings as settingsTable } from "@/db/schema";
import { SettingsForm } from "./components/settings-form";

const getSettings = cache(
  async () => {
    const settings = await db.select().from(settingsTable).get();
    if (!settings) return { error: "Settings not found" };
    return { ddl: settings.ddl };
  },
  [],
  {
    tags: ["settings"],
  },
);

export default async function SettingsPage() {
  const { ddl } = await getSettings();
  const currentDdl = ddl || "";

  return (
    <div className="py-6">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="w-full flex-row"
      >
        <TabsList className="flex-col gap-1 bg-transparent py-0">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-muted w-36 justify-start data-[state=active]:shadow-none"
          >
            Geral
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="p-6">
          <SettingsForm initialDdl={currentDdl} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
