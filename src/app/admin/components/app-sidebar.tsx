import {
  Calendar,
  ChevronRight,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  Book,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
const items = [
  {
    title: "Movie",
    url: "#",
    icon: Home,
    subItems: [
      { title: "Create movie", url: "/admin/movie" },
      { title: "List movie", url: "#" },
    ],
  },
  {
    title: "Theater",
    url: "/admin/theater",
    icon: Inbox,
    subItems: [
      { title: "Manage Theater", url: "/admin/theater" },
      { title: "Add seat", url: "#" },
    ],
  },
  {
    title: "Showtime",
    url: "#",
    icon: Calendar,
    subItems: [{ title: "Manage showtime", url: "/admin/showtime" }],
  },
  {
    title: "Blog",
    url: "#",
    icon: Book,
    subItems: [{ title: "Add blog", url: "/admin/blog" }],
  },
  {
    title: "Banner",
    url: "#",
    icon: Search,
    subItems: [{ title: "Add banner", url: "/admin/banner" }],
  },
  {
    title: "Category",
    url: "#",
    icon: Search,
    subItems: [{ title: "Add category", url: "/admin/category" }],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroupContent>
          {items.map((item) => (
            <Collapsible key={item.title} className="group/collapsible">
              <SidebarGroup className="!py-0">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.subItems && (
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.subItems?.map((sub, index) => (
                  <CollapsibleContent key={index}>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link href={sub.url}>
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ))}
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Link href={"/"}>Back to home page</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
