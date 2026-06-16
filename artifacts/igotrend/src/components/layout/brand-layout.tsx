import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useListNotifications, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";
import {
  LayoutDashboard, Megaphone, Users, MessageSquare, CreditCard, Settings, LogOut, Bell, ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/creators", icon: Users, label: "Creators" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/payments", icon: CreditCard, label: "Payments" },
  { href: "/settings/profile", icon: Settings, label: "Settings" },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const { data: user } = useGetMe();
  const { data: notifications } = useListNotifications({ query: { queryKey: getListNotificationsQueryKey() } });
  const unread = notifications?.filter(n => !n.isRead).length ?? 0;

  const handleLogout = () => {
    logoutMutation.mutate({}, { onSettled: () => { logout(); queryClient.clear(); } });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="layout-brand">
      <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="text-lg font-bold text-sidebar-foreground tracking-tight">iGoTrend</div>
          <div className="text-xs text-muted-foreground mt-0.5">Marketing Platform</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`} data-testid={`nav-${label.toLowerCase()}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors" data-testid="button-user-menu">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-medium text-sidebar-foreground truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.companyName ?? "Brand"}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild><Link href="/settings/profile"><span className="cursor-pointer w-full">Profile Settings</span></Link></DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 border-b border-border flex items-center justify-end px-6 bg-background">
          <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
            <Bell className="h-4 w-4" />
            {unread > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">{unread}</span>}
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
