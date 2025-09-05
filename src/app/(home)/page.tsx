import { Building2, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { AlertDialogDeleteTenant } from "./components/alert-dialog-delete-tenant";
import { SheetCreateTenant } from "./components/sheet-create-tenant";

export default async function Home() {
  const tenants = await db.query.tenants.findMany({
    with: {
      users: {
        columns: {
          username: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tenants Management</h1>
        <div className="flex gap-2">
          <SheetCreateTenant />
          <Link
            href="/settings"
            className={buttonVariants({ variant: "outline" })}
          >
            <SettingsIcon />
            Settings
          </Link>
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Building2 className="w-16 h-16 text-muted-foreground/50" />
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">No tenants found</p>
                      <p className="text-sm">
                        Create your first tenant to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>
                    {tenant.users.map((user) => user.username).join(", ")}
                  </TableCell>
                  <TableCell>
                    <AlertDialogDeleteTenant
                      tenantId={tenant.id}
                      tenantName={tenant.name}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
