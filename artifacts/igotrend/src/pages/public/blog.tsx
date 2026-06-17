import { PublicLayout } from "@/components/layout/public-layout";
import { Link } from "wouter";
import { ArrowRight, BookOpen, TrendingUp, Megaphone, Users } from "lucide-react";

const TEAL = "#1DCFB3";

const POSTS = [
  {
    category: "Influencer Marketing",
    title: "How West African Brands Are Winning with Micro-Influencers",
    excerpt: "Discover why brands in Nigeria, Ghana, and Kenya are seeing 3× better ROI by partnering with creators who have under 50k followers.",
    date: "June 10, 2026",
    readTime: "5 min read",
    icon: Users,
  },
  {
    category: "Trends",
    title: "Top Social Media Trends Shaping West Africa in 2026",
    excerpt: "Short-form video, live commerce, and creator-led campaigns are redefining how consumers engage with brands across the continent.",
    date: "June 4, 2026",
    readTime: "7 min read",
    icon: TrendingUp,
  },
  {
    category: "Platform Updates",
    title: "Introducing Trend AI: Your West Africa Marketing Intelligence Engine",
    excerpt: "Get campaign strategy, creator recommendations, and real-time trend insights — all powered by AI trained on the West African market.",
    date: "May 28, 2026",
    readTime: "4 min read",
    icon: Megaphone,
  },
  {
    category: "Best Practices",
    title: "How to Brief a Creator for Maximum Campaign Impact",
    excerpt: "The difference between a mediocre campaign and a viral one often comes down to how well you communicate your goals to your creator partners.",
    date: "May 20, 2026",
    readTime: "6 min read",
    icon: BookOpen,
  },
];

export default function BlogPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#141C35] to-[#1A1440] py-20 px-6 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(29,207,179,0.15)", color: TEAL }}>
            iGoTrend Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Insights for the<br />West Africa Market
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Strategies, trends, and platform news for brands, creators, and agencies across West Africa.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {POSTS.map((post, i) => {
              const Icon = post.icon;
              return (
                <article key={i} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                      <Icon className="h-4 w-4" style={{ color: TEAL }} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: TEAL }}>{post.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1DCFB3] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">{post.date} · {post.readTime}</div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#1DCFB3] group-hover:translate-x-1 transition-all" />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center mt-16 py-12 border border-dashed border-gray-200 rounded-2xl">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 font-medium">More articles coming soon.</p>
            <p className="text-sm text-gray-300 mt-1">Subscribe to our newsletter to get notified.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
