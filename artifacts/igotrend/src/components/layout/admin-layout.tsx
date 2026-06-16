import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { LayoutDashboard, Users, Megaphone, FileCheck, ShieldCheck, Wallet, Settings, LogOut, ChevronDown, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IgtLogo } from "@/components/IgtLogo";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/admin/submissions", icon: FileCheck, label: "Submissions" },
  { href: "/admin/verify-requests", icon: ShieldCheck, label: "Verifications" },
  { href: "/admin/payouts", icon: Wallet, label: "Payouts" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { data: user } = useGetMe();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate({}, { onSettled: () => { logout(); queryClient.clear(); } });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="layout-admin">
      <aside className="w-60 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #1A1440 0%, #141C35 100%)" }}>
        {/* Logo */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <IgtLogo size="sm" white />
          <div className="flex items-center gap-1.5 mt-1">
            <Shield className="h-3 w-3" style={{ color: "#FF8C42" }} />
            <div className="text-xs font-semibold" style={{ color: "#FF8C42", letterSpacing: "0.04em" }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/admin" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={active
                    ? { background: "rgba(255,140,66,0.18)", color: "#FF8C42", border: "1px solid rgba(255,140,66,0.28)" }
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
              <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors" data-testid="button-user-menu">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #FF8C42, #E05878)", color: "white" }}>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs" style={{ color: "#FF8C42" }}>Administrator</div>
                </div>
                <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border flex items-center justify-between px-6 bg-white" style={{ height: 52 }}>
          <div className="text-xs text-muted-foreground font-medium">Admin Dashboard</div>
          <div className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(255,140,66,0.12)", color: "#FF8C42" }}>
            Super Admin
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
