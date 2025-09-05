"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { toast } from "sonner";
import { updateSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SettingsFormProps {
  initialDdl: string;
}

export function SettingsForm({ initialDdl }: SettingsFormProps) {
  const [ddl, setDdl] = useState(initialDdl);
  const ddlId = useId();
  const router = useRouter();

  const { execute, isExecuting } = useAction(updateSettings, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Settings saved successfully!");
        router.push("/");
      }
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(`Server error: ${error.serverError}`);
      }
      if (error.validationErrors) {
        toast.error("Validation error in data");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute({ ddl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={ddlId} className="block text-sm font-medium mb-2">
          DDL (Data Definition Language)
        </label>
        <Textarea
          id={ddlId}
          value={ddl}
          onChange={(e) => setDdl(e.target.value)}
          placeholder="Digite o DDL aqui..."
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isExecuting}>
          Save settings
        </Button>
      </div>
    </form>
  );
}
