import {
  Plus,
  Home,
  LayoutDashboard,
  Folder,
  Settings,
  ChevronsUpDown,
} from "lucide-react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import { NavUser } from "@/components/nav-user";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-provider"; 
import { prefetchFolder } from "@/hooks/use-folder";

// Menu items.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Preferences",
    url: "/settings",
    icon: Settings,
  },
  // {
  //   title: "Folder",
  //   icon: Folder,
  //   items: [
  //     {
  //       title: "All",
  //       url: "/folder/all",
  //       icon: Calendar,
  //     },
  //   ],
  // },
];
const fetchUserFolders = async () => {
  const response = await fetch(`/api/folder`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please log in again.");
    }
    throw new Error(
      `Failed to fetch folders: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data.map((folder) => ({
    id: folder.id,
    title: folder.name,
    url: `/folder/${folder.id}`,
    icon: Folder,
    applicationCount: folder.applicationCount || 0, 
  }));
};
export function AppSidebar() {
    const queryClient = useQueryClient();

  const { isLogin, user } = useAuth();
  const {
    data: userFolders = [],
    isLoading: isLoadingFolders,
    isError: isErrorFolders,
    error: foldersError,
  } = useQuery({
    queryKey: ["userFolders", user?.id],
    queryFn: fetchUserFolders,
    enabled: !!isLogin,
  });

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{"App from Minh :)"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={{ pathname: item.url }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Folder</SidebarGroupLabel>
          <SidebarGroupAction onClick={() => {toast("implement create new folder.")}}>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isLoadingFolders &&
                !isErrorFolders &&
                userFolders.length > 0 &&
                userFolders.map((folder) => (
                  <SidebarMenuItem
                    key={folder.id || folder.title}
                    active={location.pathname === folder.url}
                    onMouseEnter={() => prefetchFolder(queryClient, folder.id)}
                  >
                    <SidebarMenuButton asChild>
                      <Link to={folder.url}>
                        <folder.icon className="" />
                        <span>{folder.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>
                      {folder.applicationCount}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
