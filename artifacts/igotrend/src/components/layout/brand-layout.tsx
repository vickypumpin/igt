import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useListNotifications, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";
import { LayoutDashboard, Megaphone, Users, MessageSquare, CreditCard, Settings, LogOut, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IgtLogo } from "@/components/IgtLogo";

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
      <aside className="w-60 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #1A1440 0%, #141C35 100%)" }}>
        {/* Logo */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <IgtLogo size="sm" white />
          <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>MARKETING PLATFORM</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${active ? "text-white" : "hover:text-white"}`}
                  style={active
                    ? { background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.28)" }
                    : { color: "rgba(255,255,255,0.55)", border: "1px solid transparent" }
                  }
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} data-testid="button-user-menu">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{user?.companyName ?? "Brand"}</div>
                </div>
                <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
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
        <header className="h-13 border-b border-border flex items-center justify-between px-6 bg-white" style={{ height: 52 }}>
          <div className="text-xs text-muted-foreground font-medium">
            Welcome back, <span className="text-foreground">{user?.firstName}</span> 👋
          </div>
          <Button variant="ghost" size="icon" className="relative h-8 w-8" data-testid="button-notifications">
            <Bell className="h-4 w-4" />
            {unread > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{unread}</span>}
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
