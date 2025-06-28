import {
  Plus,
  Home,
  LayoutDashboard,
  Folder,
  Settings,
  CloudDownload,
  ChevronRight,
  FolderLock
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { prefetchApplications,useFolders, useApplicationCount,prefetchAllApplications  } from "@/hooks/use-folder";
import { useGlobalSheet } from "@/context/sheet-provider";
import { toast } from "sonner";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
 } from "@/components/ui/collapsible";
import { useEffect } from "react";

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
  
  
];
const resources = [
  {
    title: "Resume Templates",
    url: "/resume-templates",
    icon: CloudDownload,
  },
  // {
  //   title: "Resources",
  //   url: "/resources",
  //   icon: CloudDownload,
  // },
];

export function AppSidebar() {
  const { openSheet } = useGlobalSheet();
  
  const queryClient = useQueryClient();
  const { data: applicationCount } = useApplicationCount();
  const { data: rawFolders = [], isLoading: isLoadingFolders, isError: isErrorFolders,error:foldersError } = useFolders();
  useEffect(() => {
    if (isErrorFolders) {
      toast.error(
        `Error loading folders: ${foldersError?.message || "Unknown error"}`
      );
    }
  }, [isErrorFolders, foldersError]);
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
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Resources
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {resources.map((item) => (
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>



        <SidebarGroup>
          <SidebarGroupLabel>Folder</SidebarGroupLabel>
          <SidebarGroupAction onClick={() => openSheet({
                      render: () => <FolderForm mode="create" />,
                      title: "New Folder",
                      description: "Create a new folder for your applications.",
                    })}>
            <Plus className="cursor-pointer" /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem onMouseEnter={() => prefetchAllApplications(queryClient)}> 
                
                <SidebarMenuButton asChild>
                  <Link to="/folder/all">
                    <FolderLock />
                    <span>All</span>
                  </Link>
                  
                  </SidebarMenuButton>
                  <SidebarMenuBadge>
                     {applicationCount ? applicationCount : 0} 
                  </SidebarMenuBadge>
              </SidebarMenuItem>
              {!isLoadingFolders &&
                !isErrorFolders &&
                userFolders.length > 0 &&
                userFolders.map((folder) => (
                  <SidebarMenuItem
                    key={folder.id || folder.title}
                    onMouseEnter={() => prefetchApplications(queryClient, folder.id)}
                  >
                    <SidebarMenuButton asChild>
                      <Link to={folder.url}>
                        <folder.icon />
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
