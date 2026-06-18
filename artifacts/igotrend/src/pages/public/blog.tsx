import { useEffect } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { ExternalLink } from "lucide-react";

const BLOG_URL = "https://blog.igotrend.com/";

export default function BlogPage() {
  useEffect(() => {
    window.open(BLOG_URL, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(29,207,179,0.12)" }}>
            <ExternalLink className="h-7 w-7" style={{ color: "#1DCFB3" }} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            Redirecting you to our blog…
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Our blog lives at{" "}
            <span className="font-semibold" style={{ color: "#1DCFB3" }}>blog.igotrend.com</span>.
            It should have opened in a new tab automatically.
          </p>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
          >
            Open blog <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
