import { Building2, SettingsIcon } from "lucide-react";
import { unstable_cache as cache } from "next/cache";
import Image from "next/image";
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

const getTenants = cache(
  async () => {
    return await db.query.tenants.findMany({
      columns: {
        id: true,
        name: true,
        displayName: true,
        logoUrl: true,
        primaryColor: true,
      },
      with: {
        users: {
          columns: {
            username: true,
          },
        },
      },
    });
  },
  [],
  {
    tags: ["tenants"],
  },
);

export default async function Home() {
  const tenants = await getTenants();

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
              <TableHead>Logo</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Primary Color</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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
                  <TableCell>
                    {tenant.logoUrl ? (
                      <Image
                        src={tenant.logoUrl}
                        alt={`${tenant.displayName || tenant.name} logo`}
                        className="rounded object-cover"
                        width={32}
                        height={32}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.displayName || "N/A"}</TableCell>
                  <TableCell>
                    {tenant.primaryColor ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: tenant.primaryColor }}
                        />
                        <span className="text-sm font-mono">
                          {tenant.primaryColor}
                        </span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
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
