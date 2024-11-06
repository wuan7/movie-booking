"use client";
import { Loader, LogOut, ShieldCheck, Ticket } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "../api/use-current-user";
import Link from "next/link";

export const UserAvatar = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { image, name } = data;

  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage src={image} alt="avatar" />
          <AvatarFallback className="bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom" className="w-60">
        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOut className="size-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10">
          <Link href={"/ticket"} className="flex items-center">
            <Ticket className="size-4 mr-2" />
            Thông tin mua vé
          </Link>
        </DropdownMenuItem>
        {data.role === "admin" && (
          <DropdownMenuItem className="h-10">
            <Link href={"/admin"} className="flex items-center">
              <ShieldCheck className="size-4 mr-2" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
