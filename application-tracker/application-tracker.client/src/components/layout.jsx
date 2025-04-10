import { useAuth } from '@/context/auth-provider';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar" 
import { AppSidebar } from "@/components/app-sidebar" 
import { Separator } from "@/components/ui/separator" 
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {Breadcrumb,BreadcrumbPage,BreadcrumbSeparator, BreadcrumbItem, BreadcrumbList, BreadcrumbLink} from "@/components/ui/breadcrumb"

import { Outlet } from "react-router-dom"; 

export  function Layout() { 
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <AppSidebar /> 
      <div className="flex flex-col flex-grow"> 
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    example
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Example</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main > 
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
  )
}