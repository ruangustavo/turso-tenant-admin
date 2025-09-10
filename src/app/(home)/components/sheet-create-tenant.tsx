"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusIcon, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { createTenant } from "@/actions/tenant";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SubmitButton } from "@/components/ui/submit-button";
import { createTenantSchema } from "../utils/schema";

const normalizeDisplayName = (displayName: string): string => {
  return displayName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

type CreateTenantForm = z.infer<typeof createTenantSchema>;

interface SheetCreateTenantProps {
  onTenantCreated?: () => void;
}

export function SheetCreateTenant({ onTenantCreated }: SheetCreateTenantProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTenantForm>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      displayName: "",
      logoUrl: "",
      primaryColor: "#3b82f6",
      users: [{ username: "", password: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  const { execute, isExecuting } = useAction(createTenant, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Tenant criado com sucesso!");
        form.reset();
        setOpen(false);
        onTenantCreated?.();
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(`Erro no servidor: ${error.serverError}`);
      }
      if (error.validationErrors) {
        toast.error("Erro de validação nos dados");
      }
    },
  });

  const onSubmit = async (data: CreateTenantForm) => {
    execute(data);
  };

  const addUser = () => {
    append({ username: "", password: "" });
  };

  const removeUser = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const primaryColorId = useId();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4" />
          New tenant
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4 w-[400px] sm:w-[540px]">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Create New Tenant</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the display name"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        const normalizedName = normalizeDisplayName(value);
                        form.setValue("name", normalizedName);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the tenant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the logo URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <div className="relative dark:bg-input/30">
                      <input
                        type="color"
                        id={primaryColorId}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3 h-9 px-3 py-1 border border-input rounded-md bg-transparent shadow-xs transition-[color,box-shadow] cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <div
                          className="size-5 rounded-sm border-2 border-border shadow-sm"
                          style={{ backgroundColor: field.value }}
                        />
                        <span className="text-sm font-mono text-foreground">
                          {field.value?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Users</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUser}
                >
                  <Plus className="h-4 w-4" />
                  Add user
                </Button>
              </div>

              <div className="divide-y divide-muted-foreground/20">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 py-4">
                    <div className="flex items-center justify-between h-8">
                      <h4 className="font-medium">User {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUser(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`users.${index}.username`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the user" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`users.${index}.password`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter the password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="p-0">
              <SubmitButton isSubmitting={isExecuting}>
                Create tenant
              </SubmitButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
