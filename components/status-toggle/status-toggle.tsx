// components/status-toggle.tsx
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type StatusToggleProps = {
  active: boolean;
  activeTitle: string;
  inactiveTitle: string;
  activeDescription: string;
  inactiveDescription: string;
  activeConfirmText: string;
  inactiveConfirmText: string;
  onConfirm?: (loadingCallback: (state: boolean) => void) => void;
  disabled?: boolean;
};

export function StatusToggle({
  active,
  onConfirm,
  disabled,
  activeTitle,
  inactiveTitle,
  activeDescription,
  inactiveDescription,
  activeConfirmText,
  inactiveConfirmText,
}: StatusToggleProps) {
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    onConfirm?.(setLoading);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-transparent p-0 h-fit hover:bg-transparent" disabled={loading}>
          {loading ? (
            <Spinner className="size-5 text-gray-500" />
          ) : (
            <Badge
              variant={active ? "active" : "inactive"}
              className={cn(
                "cursor-pointer select-none py-1 px-4 font-bold text-sm",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              {active ? "Active" : "Inactive"}
            </Badge>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{active ? activeTitle : inactiveTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {active ? activeDescription : inactiveDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            className={cn(
              active
                ? "bg-destructive text-white hover:bg-destructive/70"
                : "bg-green-600 text-white hover:bg-green-600/70"
            )}
          >
            {active ? activeConfirmText : inactiveConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
