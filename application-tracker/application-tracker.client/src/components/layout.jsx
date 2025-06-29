import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EditingSheet } from "@/components/editing-sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/context/auth-provider";
import { AppShortcuts } from "@/components/shortcuts";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Outlet } from "react-router-dom";
import { GlobalSheetProvider } from "@/context/sheet-provider";
import { CommandDialogProvider } from "@/context/command-provider";
import {ModeToggle} from "@/components/mode-toggle.jsx";
import { GlobalCommandDialog } from "@/components/command-dialog";

export function Layout() {
  const navigate = useNavigate();
  const { isLogin, user } = useAuth();
  return (
    <CommandDialogProvider>
      <GlobalCommandDialog />
    <GlobalSheetProvider>
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-grow">
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <SidebarTrigger className="-ml-1" />
         
          <div className="flex items-center gap-4">
            <ModeToggle/>
            
            {isLogin && user ? (
              <>
                {/* <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePictureUrl || "/default-avatar.png"} alt={user.firstName} />
                  <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                </Avatar> */}
              </>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline">
                Login
              </Button>
            )}
             
          </div>
        </header>
        <main>
          
          <Outlet />
          <EditingSheet/>
          <AppShortcuts />
        </main>
      </div>
    </SidebarProvider>
      </GlobalSheetProvider>
    </CommandDialogProvider>
  );
}
