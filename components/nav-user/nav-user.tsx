"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "../auth/auth-context";

export default function NavUser() {
  const { user, isLoggedIn, logout } = useAuth();
  const t = useTranslations("menu");
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="font-medium transition inline-flex px-2 py-1 gap-2 items-center text-white border border-white"
      >
        {t("login")}
      </Link>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-1 text-white text-sm cursor-pointer outline-none capitalize border border-white px-2 py-1">
        {user?.first_name + " " + user?.last_name}
        <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          className="rounded-none min-w-0 w-auto p-2 flex flex-col"
          updatePositionStrategy="always"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuItem asChild>
            <Link href="/settings" className="px-2 py-1 text-off-black text-sm cursor-pointer">
              {t("profile")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/history" className="px-2 py-1 text-off-black text-sm cursor-pointer">
              {t("history")}
            </Link>
          </DropdownMenuItem>

          {user.is_admin ? (
            <DropdownMenuItem asChild>
              <Link href="/admin/users" className="px-2 py-1 text-off-black text-sm cursor-pointer">
                Admin
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="px-2 py-1 text-primary text-sm cursor-pointer"
            onClick={() => logout()}
          >
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}



