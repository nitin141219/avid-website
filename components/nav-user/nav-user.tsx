"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "../auth/auth-context";
import { Button } from "../ui/button";

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
          className="rounded-none min-w-20 p-2 flex flex-col"
          updatePositionStrategy="always"
          side="bottom"
          sideOffset={4}
        >
          {user.is_admin ? (
            <Link href={"/admin/users"} className="text-primary text-sm hover:">
              Admin
            </Link>
          ) : null}

          <Button
            variant="link"
            className="font-medium transition inline-flex h-fit mt-2 gap-2 items- justify-start rounded-md rounded-b-none  hover:no-underline text-sm p-0"
            onClick={() => logout()}
          >
            {t("logout")}
          </Button>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
