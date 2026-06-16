import { useState } from "react";
import { Link, useLocation } from "wouter";
import { IgtLogo } from "@/components/IgtLogo";
import { Menu, X, ChevronDown, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Brands & Advertiser", href: "/brands" },
  { label: "Influencers & Creators", href: "/influencers-creators" },
  { label: "Services", href: "/services" },
];

const resourceLinks = [
  { label: "Community Guidelines", href: "/community-guidelines" },
  { label: "Blog", href: "/blog" },
  { label: "Help Center", href: "/help" },
];

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "GDPR", href: "/gdpr" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fafbff" }}>
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <IgtLogo size="md" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === l.href
                      ? "text-[#1DCFB3] bg-[#1DCFB3]/8"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              {/* Resources dropdown */}
              <div className="relative" onMouseLeave={() => setResourcesOpen(false)}>
                <button
                  onMouseEnter={() => setResourcesOpen(true)}
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Resources <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    {resourceLinks.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        onClick={() => setResourcesOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {r.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Auth buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Register
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                {l.label}
              </Link>
            ))}
            {resourceLinks.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 pl-6"
              >
                {r.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer style={{ background: "#141C35" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand col */}
            <div className="md:col-span-2">
              <IgtLogo size="md" white />
              <p className="mt-3 text-sm text-white/55 max-w-xs leading-relaxed">
                West Africa's leading influencer marketing platform connecting brands with authentic content creators.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-5">
                {[
                  { Icon: Facebook, href: "#" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Youtube, href: "#" },
                  { Icon: Linkedin, href: "#" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <Icon className="h-4 w-4 text-white/70" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Platform</p>
              <ul className="space-y-2.5">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Legal</p>
              <ul className="space-y-2.5">
                {footerLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} iGoTrend. All rights reserved.
            </p>
            <div className="flex gap-4">
              {footerLinks.map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-white/35 hover:text-white/60 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
