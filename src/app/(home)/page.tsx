import { SettingsIcon } from "lucide-react";
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
import { SheetCreateTenant } from "./components/sheet-create-tenant";

export default function Home() {
  const tenantsData = [
    { id: 1, name: "Empresa ABC", user: "João Silva" },
    { id: 2, name: "Corporação XYZ", user: "Maria Santos" },
    { id: 3, name: "Tech Solutions", user: "Pedro Oliveira" },
  ];

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenantsData.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
