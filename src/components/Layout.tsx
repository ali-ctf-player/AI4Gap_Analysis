import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 shrink-0">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <span className="text-sm text-muted-foreground">SecureGRC Platform</span>
            </div>
            <Button asChild variant={isProfilePage ? "default" : "outline"} size="sm" className="gap-2">
              <Link to="/profile">
                <UserRound className="h-4 w-4" />
                Profile
              </Link>
            </Button>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
