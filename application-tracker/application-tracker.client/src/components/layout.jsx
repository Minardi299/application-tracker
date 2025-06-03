import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Fragment } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Outlet } from "react-router-dom";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function Layout() {
  const navigate = useNavigate();
  const { isLogin, user } = useAuth();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-grow">
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      <span className="sr-only">Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />


                {pathnames.length > 0 &&
                  pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    // Replace hyphens with spaces and capitalize for display
                    const displayName = name
                      .split("-")
                      .map(capitalizeFirstLetter)
                      .join(" ");

                    return (
                      <Fragment key={name + index}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{displayName}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={routeTo}>{displayName}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </Fragment>
                    );
                  })
}

              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            {isLogin && user ? (
              <>
                {/* You can add a user dropdown menu here if needed */}
                {/* For now, just showing the avatar as an example */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePictureUrl || "/default-avatar.png"} alt={user.firstName} />
                  <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
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
        </main>
      </div>
    </SidebarProvider>
  );
}
