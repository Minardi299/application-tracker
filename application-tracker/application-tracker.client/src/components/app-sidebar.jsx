import { Calendar, Home, LayoutDashboard, Folder, Settings, ChevronsUpDown } from "lucide-react"
import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import { NavUser } from "@/components/nav-user"
import { useQuery } from '@tanstack/react-query'; 
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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; 
import { useAuth } from '@/context/auth-provider'; // To get token and login state

// Menu items.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
}
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
]
const fetchUserFolders = async () => {
  
  const response = await fetch(`/api/folder`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again.");
    }
    throw new Error(`Failed to fetch folders: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.map(folder => ({
    id: folder.id,
    title: folder.name,
    url: `/folder/${folder.id}`,
    icon: Folder, 
  }));
};
export function AppSidebar() {
    const { isLogin, user } = useAuth(); 
    const {
    data: userFolders = [], 
    isLoading: isLoadingFolders,
    isError: isErrorFolders,
    error: foldersError
  } = useQuery({
    queryKey: ['userFolders', user.id], 
    queryFn: () => fetchUserFolders(),
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
                    <Link to={{pathname: item.url}}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              { isLogin && (
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="justify-between w-full">
                        <div className="flex items-center">
                          <Folder className="h-5 w-5 mr-2" />
                          <span>My Folders</span>
                        </div>
                        <SidebarMenuAction asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 group-[[data-state=open]]/collapsible:rotate-180 transition-transform">
                               <ChevronsUpDown className="h-4 w-4"/>
                            </Button>
                        </SidebarMenuAction>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                      {!isLoadingFolders && !isErrorFolders && userFolders.length > 0 && (
                        userFolders.map((folder) => (
                          <SidebarMenuItem key={folder.id || folder.title} active={location.pathname === folder.url} className="pl-3">
                            <SidebarMenuButton asChild>
                              <Link to={folder.url}>
                                <folder.icon className="h-5 w-5 mr-2" />
                                <span>{folder.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))
                      )}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
