"use client";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-23 items-center justify-between border-b bg-background px-6">
      {/* <h1 className="text-3xl font-bold text-off-black">Admin</h1> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="focus-visible:ring-0 capitalize font-semibold ml-auto">
            {user?.first_name + " " + user?.last_name} <User className="size-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="rounded-none p-2 flex flex-col"
          updatePositionStrategy="always"
          side="bottom"
          sideOffset={4}
        >
          {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
          <Button
            variant="link"
            className="font-medium transition inline-flex h-fit gap-2 items- justify-start rounded-md rounded-b-none hover:no-underline text-sm p-0 text-destructive"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
