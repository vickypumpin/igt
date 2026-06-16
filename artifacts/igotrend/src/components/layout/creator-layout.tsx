import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useGetMe, useListNotifications } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";
import { LayoutDashboard, Inbox, Upload, Coins, MessageSquare, Settings, LogOut, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link as WLink } from "wouter";
import { IgtLogo } from "@/components/IgtLogo";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/invites", icon: Inbox, label: "Invites" },
  { href: "/submissions/new", icon: Upload, label: "Submit" },
  { href: "/earnings", icon: Coins, label: "Earnings" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/settings/profile", icon: Settings, label: "Settings" },
];

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { data: user } = useGetMe();
  const logoutMutation = useLogout();
  const { data: notifications } = useListNotifications({ query: { queryKey: getListNotificationsQueryKey() } });
  const unread = notifications?.filter(n => !n.isRead).length ?? 0;

  const handleLogout = () => {
    logoutMutation.mutate({}, { onSettled: () => { logout(); queryClient.clear(); } });
  };

  const badgeColor: Record<string, string> = {
    micro: "rgba(29,207,179,0.25)",
    macro: "rgba(107,47,206,0.25)",
    mega: "rgba(249,199,79,0.25)",
    nano: "rgba(224,88,120,0.25)",
  };
  const badgeText: Record<string, string> = {
    micro: "#0FA88E",
    macro: "#8B5CF6",
    mega: "#D97706",
    nano: "#E05878",
  };
  const badge = user?.badge?.toLowerCase() ?? "creator";

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="layout-creator">
      <aside className="w-60 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #1A1440 0%, #141C35 100%)" }}>
        {/* Logo */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <IgtLogo size="sm" white />
          <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>CREATOR PORTAL</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all`}
                  style={active
                    ? { background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.28)" }
                    : { color: "rgba(255,255,255,0.55)", border: "1px solid transparent" }
                  }
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {label === "Invites" && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(29,207,179,0.25)", color: "#1DCFB3" }}>new</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors" data-testid="button-user-menu">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold text-white truncate">@{user?.userName}</div>
                  <div className="text-xs px-1.5 py-0.5 rounded-full inline-block capitalize font-medium" style={{ background: badgeColor[badge] ?? "rgba(255,255,255,0.1)", color: badgeText[badge] ?? "rgba(255,255,255,0.5)" }}>
                    {user?.badge ?? "Creator"}
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild><WLink href="/settings/profile"><span className="cursor-pointer w-full">Profile Settings</span></WLink></DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border flex items-center justify-between px-6 bg-white" style={{ height: 52 }}>
          <div className="text-xs text-muted-foreground font-medium">
            Hey <span className="text-foreground">@{user?.userName}</span> — let's trend 🔥
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
