import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
}

interface NavGroupProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: NavItem[];
  badge?: number;
  activeColor?: string;
  activeBg?: string;
  activeBorder?: string;
}

export function NavGroup({
  icon: Icon,
  label,
  items,
  badge,
  activeColor = "#1DCFB3",
  activeBg = "rgba(29,207,179,0.18)",
  activeBorder = "rgba(29,207,179,0.28)",
}: NavGroupProps) {
  const [location] = useLocation();

  const isChildActive = items.some(
    (item) => location === item.href || location.startsWith(item.href + "?") || location.startsWith(item.href + "/")
  );

  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
        style={
          isChildActive
            ? { background: activeBg, color: activeColor, border: `1px solid ${activeBorder}` }
            : { color: "rgba(255,255,255,0.55)", border: "1px solid transparent" }
        }
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">{label}</span>
        {badge != null && badge > 0 && (
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
            style={{ background: activeColor, color: "#141C35" }}
          >
            {badge}
          </span>
        )}
        <ChevronDown
          className="h-3.5 w-3.5 flex-shrink-0 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none", opacity: 0.5 }}
        />
      </button>

      {open && (
        <div className="ml-3 mt-0.5 pl-4 space-y-0.5" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
          {items.map((item) => {
            const active = location === item.href || location.startsWith(item.href + "?") || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all"
                  style={
                    active
                      ? { color: activeColor, background: activeBg }
                      : { color: "rgba(255,255,255,0.45)" }
                  }
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number | string;
  activeColor?: string;
  activeBg?: string;
  activeBorder?: string;
  exact?: boolean;
}

export function NavLink({
  href,
  icon: Icon,
  label,
  badge,
  activeColor = "#1DCFB3",
  activeBg = "rgba(29,207,179,0.18)",
  activeBorder = "rgba(29,207,179,0.28)",
  exact = false,
}: NavLinkProps) {
  const [location] = useLocation();
  const active = exact ? location === href : location === href || (href !== "/" && location.startsWith(href));

  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
        style={
          active
            ? { background: activeBg, color: activeColor, border: `1px solid ${activeBorder}` }
            : { color: "rgba(255,255,255,0.55)", border: "1px solid transparent" }
        }
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">{label}</span>
        {badge != null && Number(badge) > 0 && (
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
            style={{ background: activeColor, color: "#141C35" }}
          >
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}
