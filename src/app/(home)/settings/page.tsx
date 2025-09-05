import { getSettings } from "@/actions/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsForm } from "./components/settings-form";

export default async function SettingsPage() {
  const settingsResult = await getSettings();
  const currentDdl = settingsResult.data?.ddl || "";

  return (
    <div className="py-6">
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
