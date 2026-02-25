"use client";

import { useAuth } from "@/components/auth/auth-context";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-23 items-center justify-between border-b bg-background px-6">
      {/* <h1 className="text-3xl font-bold text-off-black">Admin</h1> */}

      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto flex items-center gap-1 text-sm cursor-pointer outline-none capitalize border border-off-black px-2 py-1">
          {user?.first_name + " " + user?.last_name}
          <ChevronDown size={14} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="rounded-none min-w-0 w-auto p-2 flex flex-col"
          updatePositionStrategy="always"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuItem asChild>
            <Link href="/settings" className="px-2 py-1 text-off-black text-sm cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/users" className="px-2 py-1 text-off-black text-sm cursor-pointer">
              Admin
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="px-2 py-1 text-primary text-sm cursor-pointer" onClick={() => logout()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


