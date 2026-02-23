// components/confirm-dialog.tsx
"use client";

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
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

type ConfirmDialogProps = {
  onConfirm: (loadingCallback: (state: boolean) => void) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
};

export function ConfirmDialog({
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClassName = "",
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    onConfirm(setLoading);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive" className="rounded-full" disabled={loading}>
          {loading ? <Spinner /> : <Trash className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            className={cn("bg-secondary text-white hover:bg-secondary/70", confirmButtonClassName)}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
