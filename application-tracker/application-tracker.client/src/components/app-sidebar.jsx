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
import { FolderForm } from "@/components/forms/folder-form";
import { NavUser } from "@/components/nav-user";
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
import { prefetchFolder,useFolders  } from "@/hooks/use-folder";
import { useGlobalSheet } from "@/context/sheet-provider";

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

export function AppSidebar() {
  const { openSheet } = useGlobalSheet();

  const queryClient = useQueryClient();
  const { data: rawFolders = [], isLoading: isLoadingFolders, isError: isErrorFolders,error:foldersError } = useFolders();
  const userFolders = rawFolders.map(folder => ({
      id: folder.id,
      title: folder.name,
      url: `/folder/${folder.id}`,
      icon: Folder,
      applicationCount: folder.applicationCount || 0,
    }));
  

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
          <SidebarGroupAction onClick={() => openSheet({
                      render: () => <FolderForm mode="create" />,
                      title: "New Folder",
                      description: "Create a new folder for your applications.",
                    })}>
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
