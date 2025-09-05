"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusIcon, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
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
import { createTenantSchema } from "../utils/schema";

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
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
              <Button type="submit" disabled={isExecuting}>
                Create tenant
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
