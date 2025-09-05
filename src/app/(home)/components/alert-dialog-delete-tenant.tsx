"use client";

import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteTenant } from "@/actions/tenant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AlertDialogDeleteTenantProps {
  tenantId: number;
  tenantName: string;
}

export function AlertDialogDeleteTenant({
  tenantId,
  tenantName,
}: AlertDialogDeleteTenantProps) {
  const { execute, isExecuting } = useAction(deleteTenant, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Tenant deletado com sucesso!");
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

  const handleDelete = () => {
    execute({ id: tenantId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o tenant{" "}
            <strong>{tenantName}</strong>? Esta ação não pode ser desfeita e
            todos os dados relacionados serão perdidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isExecuting}
            >
              Deletar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
