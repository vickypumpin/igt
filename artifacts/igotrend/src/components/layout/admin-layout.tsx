import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import {
  LayoutDashboard, Users, Megaphone, Wallet, Settings, LogOut,
  ChevronDown, Shield, MessageSquare, HelpCircle, FileText, Bell, BarChart2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IgtLogo } from "@/components/IgtLogo";
import { NavGroup, NavLink } from "./nav-group";

const ORANGE = "#FF8C42";
const ORANGE_BG = "rgba(255,140,66,0.18)";
const ORANGE_BORDER = "rgba(255,140,66,0.28)";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { data: user } = useGetMe();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate({}, { onSettled: () => { logout(); queryClient.clear(); } });
  };

  const initials = `${user?.firstName?.[0] ?? "A"}${user?.lastName?.[0] ?? "D"}`;

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="layout-admin">
      <aside className="w-64 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #1A1440 0%, #141C35 100%)" }}>
        {/* Logo + Portal title */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <IgtLogo size="sm" white />
          <div className="flex items-center gap-1.5 mt-1.5">
            <Shield className="h-3 w-3" style={{ color: ORANGE }} />
            <span className="text-xs font-semibold" style={{ color: ORANGE, letterSpacing: "0.04em" }}>IGT Administration &amp; Management</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" exact activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />

          <NavGroup
            icon={Users}
            label="Account Mgt"
            activeColor={ORANGE}
            activeBg={ORANGE_BG}
            activeBorder={ORANGE_BORDER}
            items={[
              { href: "/admin/accounts", label: "All Accounts" },
              { href: "/admin/accounts/brands", label: "Brand Accounts" },
              { href: "/admin/accounts/creators", label: "Creator Accounts" },
              { href: "/admin/accounts/agencies", label: "Agency Accounts" },
              { href: "/admin/accounts/pending", label: "Pending Accounts" },
            ]}
          />

          <NavGroup
            icon={Megaphone}
            label="Campaign Mgt"
            activeColor={ORANGE}
            activeBg={ORANGE_BG}
            activeBorder={ORANGE_BORDER}
            items={[
              { href: "/admin/campaigns", label: "All Campaigns" },
              { href: "/admin/campaigns/active", label: "Active Campaigns" },
              { href: "/admin/campaigns/pending", label: "Pending Campaigns" },
            ]}
          />

          <NavLink href="/admin/payouts" icon={Wallet} label="Payments" activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />

          <NavGroup
            icon={Shield}
            label="Approval Request"
            activeColor={ORANGE}
            activeBg={ORANGE_BG}
            activeBorder={ORANGE_BORDER}
            items={[
              { href: "/admin/verify-requests", label: "Pending Requests" },
              { href: "/admin/verify-requests/approved", label: "Approved" },
              { href: "/admin/verify-requests/declined", label: "Declined" },
            ]}
          />

          <NavGroup
            icon={MessageSquare}
            label="Messaging"
            activeColor={ORANGE}
            activeBg={ORANGE_BG}
            activeBorder={ORANGE_BORDER}
            items={[
              { href: "/admin/messages", label: "All Messages" },
              { href: "/admin/messages/broadcast", label: "Broadcast" },
            ]}
          />

          <NavGroup
            icon={Settings}
            label="Settings"
            activeColor={ORANGE}
            activeBg={ORANGE_BG}
            activeBorder={ORANGE_BORDER}
            items={[
              { href: "/admin/settings", label: "General" },
              { href: "/admin/settings/fees", label: "Fees & Taxes" },
              { href: "/admin/settings/gateway", label: "Payment Gateway" },
              { href: "/admin/settings/smtp", label: "SMTP" },
            ]}
          />

          <NavLink href="/admin/submissions" icon={FileText} label="Submissions" activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />
          <NavLink href="/admin/reports" icon={BarChart2} label="Reports" activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />
          <NavLink href="/admin/roles" icon={Shield} label="Roles & Permissions" activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />
          <NavLink href="/admin/faqs" icon={HelpCircle} label="FAQs" activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />
          <NavLink href="/admin/legal" icon={FileText} label="Legal Pages" activeColor={ORANGE} activeBg={ORANGE_BG} activeBorder={ORANGE_BORDER} />
        </nav>

        {/* User footer / account dropdown */}
        <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5" data-testid="button-user-menu">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="text-xs font-bold" style={{ background: `linear-gradient(135deg, ${ORANGE}, #E05878)`, color: "white" }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs font-medium" style={{ color: ORANGE }}>IGT Admin</div>
                </div>
                <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/admin/account"><span className="cursor-pointer w-full">Edit Account</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border flex items-center justify-between px-6 bg-white" style={{ height: 52 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide" style={{ color: ORANGE }}>HOME</span>
            <span>/</span>
            <span className="uppercase tracking-wide font-medium text-foreground">
              {location === "/admin" ? "DASHBOARD" : location.replace("/admin/", "").replace(/-/g, " ").toUpperCase()}
            </span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
