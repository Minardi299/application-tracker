import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar" //
import { AppSidebar } from "@/components/app-sidebar" //
import { Outlet } from "react-router-dom"; // Import Outlet

export  function Layout() { // Removed children prop
  return (
    <SidebarProvider>
      <AppSidebar /> 
      <div className="flex flex-col flex-grow"> 
        <header >
           <SidebarTrigger /> 
        </header>
        <main > 
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
  )
}