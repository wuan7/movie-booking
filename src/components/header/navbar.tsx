import { MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { UserAvatar } from "@/features/auth/components/user-button";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
export const Navbar = () => {
  return (
    <nav className=" flex flex-col max-w-screen-xl mx-auto p-1.5">
      <div className=" flex items-center  p-1.5 h-12 ">
        <div className="flex-1 flex ">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
          </Link>
        </div>
        <div className="min-w-[280px] max-[624px] grow-[2] shrink">
          <Button
            size="sm"
            className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          >
            <Search className="size-4 text-white mr-2" />
            <span className="text-white text-xs">Search </span>
          </Button>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end">
          <UserAvatar />
        </div>
      </div>
      <Separator className="my-1 hidden md:flex" />
      <div className="hidden md:flex items-center justify-between">
        <div>
          <Button
            variant="transparent"
            className="hover:bg-transparent font-semibold hover:text-yellow-500 text-white"
          >
            <MapPin className="size-5"/>
            Select cinema
          </Button>
          <Button
            variant="transparent"
            className="hover:bg-transparent font-semibold hover:text-yellow-500 text-white"
          >
            <MapPin className="size-5"/>
            Showtimes
          </Button>
        </div>
        <div className="flex items-center gap-x-5">
          <Link href="/blog" className="hover:underline hover:text-yellow-500 text-white font-semibold transition">
            Blog
          </Link>
         
        </div>
      </div>
    </nav>
  );
};
