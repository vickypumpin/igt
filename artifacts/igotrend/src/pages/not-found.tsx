import { Link } from "wouter";
import { IgtLogo } from "@/components/IgtLogo";
import { GeomDecor } from "@/components/GeomDecor";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f0fdfb 0%, #f5f3ff 50%, #fef9f5 100%)" }}>
      <GeomDecor />

      <div className="text-center max-w-sm px-6 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <IgtLogo size="lg" />
        </div>

        {/* 404 big number */}
        <div className="text-[7rem] leading-none font-black mb-4 select-none"
          style={{ background: "linear-gradient(135deg, #1DCFB3 0%, #6B2FCE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          404
        </div>

        <h1 className="text-xl font-extrabold text-foreground mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", boxShadow: "0 8px 24px rgba(29,207,179,0.35)" }}>
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
