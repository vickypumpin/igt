import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import {
  LayoutDashboard, Megaphone, Users, Wallet, LogOut, Bell,
  ChevronDown, HelpCircle, Bot, Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IgtLogo } from "@/components/IgtLogo";
import { NavGroup, NavLink } from "./nav-group";

const PURPLE = "#6B2FCE";
const PURPLE_BG = "rgba(107,47,206,0.18)";
const PURPLE_BORDER = "rgba(107,47,206,0.28)";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/community-guidelines" },
  { label: "TOS", href: "/tos" },
];

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const { data: user } = useGetMe();

  const handleLogout = () => {
    logoutMutation.mutate(undefined as unknown as void, { onSettled: () => { logout(); queryClient.clear(); } });
  };

  const initials = `${user?.firstName?.[0] ?? "A"}${user?.lastName?.[0] ?? "G"}`;
  const supportPin = String(user?.id ?? 0).padStart(4, "0").slice(-4);

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="layout-agency">
      <aside className="w-64 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #1A1440 0%, #141C35 100%)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <IgtLogo size="sm" white />
          <div className="text-xs mt-1.5 font-semibold" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>Agency Portal</div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <NavLink href="/agency/dashboard" icon={LayoutDashboard} label="Dashboard" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
          <NavLink href="/agency/clients" icon={Users} label="Clients" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
          <NavLink href="/agency/campaigns" icon={Megaphone} label="Campaigns" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
          <NavLink href="/agency/billing" icon={Wallet} label="Billing" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
          <NavLink href="/agency/settings" icon={Settings} label="Settings" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
          <NavLink href="/trend-ai" icon={Bot} label="Trend Ai" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
          <NavLink href="/faq" icon={HelpCircle} label="FAQ" activeColor={PURPLE} activeBg={PURPLE_BG} activeBorder={PURPLE_BORDER} />
        </nav>

        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="rounded-xl px-3 py-2.5 flex items-center gap-2"
            style={{ background: "rgba(107,47,206,0.12)", border: "1px solid rgba(107,47,206,0.25)" }}>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>SUPPORT PIN:</div>
            <div className="text-sm font-black tracking-widest" style={{ color: PURPLE }}>{supportPin}</div>
          </div>
        </div>

        <div className="px-4 pb-3 flex flex-wrap gap-x-3 gap-y-1">
          {LEGAL_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5" data-testid="button-user-menu">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="text-xs font-bold" style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)`, color: "white" }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs font-medium" style={{ color: PURPLE }}>Agency</div>
                </div>
                <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/agency/settings"><span className="cursor-pointer w-full">Settings</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/agency/billing"><span className="cursor-pointer w-full">Billing</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border flex items-center justify-between px-6 bg-white" style={{ height: 52 }}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide" style={{ color: PURPLE }}>HOME</span>
            <span>/</span>
            <span className="uppercase tracking-wide font-medium text-foreground">
              {location.replace(/^\/agency\/?/, "").replace(/-/g, " ").toUpperCase() || "DASHBOARD"}
            </span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" data-testid="button-notifications">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
