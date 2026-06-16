import { PublicLayout } from "@/components/layout/public-layout";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const sections = [
  {
    title: "1. Authenticity & Transparency",
    icon: CheckCircle,
    color: "#1DCFB3",
    items: [
      "All sponsored content must be clearly disclosed using #Ad, #Sponsored, or #Paid partnership labels as appropriate.",
      "Do not artificially inflate follower counts, engagement rates, or reach through bots or purchased followers.",
      "Represent your content niche and audience demographics accurately in your Trender profile.",
      "Ensure all statistics shared with brands are based on real, verifiable platform analytics.",
    ],
  },
  {
    title: "2. Content Standards",
    icon: Shield,
    color: "#6B2FCE",
    items: [
      "All content created through iGoTrend campaigns must comply with the advertising standards and community guidelines of the respective social media platform.",
      "Content must not contain hate speech, discrimination, or harassment of any individual or group.",
      "Sexual, violent, or graphic content is strictly prohibited unless explicitly approved for adult-oriented campaigns.",
      "Misleading claims about products or services are not permitted and may result in account suspension.",
      "Respect copyright and intellectual property rights in all content created.",
    ],
  },
  {
    title: "3. Professional Conduct",
    icon: CheckCircle,
    color: "#0EA5E9",
    items: [
      "Respond to brand communications within 48 hours of receiving a campaign invitation.",
      "Deliver campaign content on or before the agreed deadline unless extenuating circumstances are communicated in advance.",
      "Maintain professional communication with all brands and platform staff.",
      "Do not solicit brands directly outside of the iGoTrend platform to circumvent our payment system.",
      "Honor all accepted campaign commitments. Repeated cancellations may result in account penalties.",
    ],
  },
  {
    title: "4. Prohibited Conduct",
    icon: XCircle,
    color: "#EF4444",
    items: [
      "Do not create or share content that promotes illegal activities, drugs, weapons, or gambling.",
      "Do not impersonate other creators, brands, or public figures.",
      "Do not engage in price manipulation or false advertising with brands.",
      "Do not create multiple accounts to circumvent bans or restrictions.",
      "Do not share confidential brand information from campaign briefs outside the platform.",
    ],
  },
  {
    title: "5. Brand Responsibilities",
    icon: Shield,
    color: "#F59E0B",
    items: [
      "Brands must provide clear, complete campaign briefs to creators prior to campaign start.",
      "Brands must ensure all product/service claims in campaign briefs are accurate and substantiated.",
      "Campaign content that conflicts with platform guidelines or local laws cannot be commissioned.",
      "Brands must process creator payments through the iGoTrend platform — off-platform payments violate our terms.",
      "Brands are responsible for ensuring their campaigns comply with Nigerian Advertising Standards Agency (ARCON) regulations.",
    ],
  },
  {
    title: "6. Dispute Resolution",
    icon: AlertTriangle,
    color: "#8B5CF6",
    items: [
      "All disputes between brands and creators should first be attempted to be resolved through the iGoTrend messaging system.",
      "If a resolution cannot be reached, either party may escalate to the iGoTrend support team using their Support PIN.",
      "The iGoTrend team will review submitted evidence from both parties and issue a final decision within 5 business days.",
      "Fraudulent claims during dispute resolution will result in immediate account suspension.",
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <section
        className="py-20 text-center"
        style={{ background: "linear-gradient(135deg, #1a0a3e 0%, #2d1569 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(29,207,179,0.2)" }}>
            <Shield className="h-8 w-8" style={{ color: "#1DCFB3" }} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Community Guidelines</h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            These guidelines ensure iGoTrend remains a trusted, professional, and effective platform for brands and creators across West Africa.
          </p>
          <p className="text-white/40 text-sm mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="p-6 rounded-2xl border border-[#1DCFB3]/30 bg-[#1DCFB3]/5">
            <p className="text-gray-700 leading-relaxed">
              iGoTrend is West Africa's leading influencer marketing platform, connecting brands with authentic content creators (Trenders). To maintain the highest standards of professionalism, authenticity, and trust, all users — brands and creators alike — must adhere to these community guidelines. Violation of these guidelines may result in content removal, campaign suspension, or permanent account termination.
            </p>
          </div>
        </div>
      </section>

      {/* Guidelines sections */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-gray-100" style={{ background: `${section.color}08` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${section.color}18` }}>
                  <section.icon className="h-5 w-5" style={{ color: section.color }} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: section.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enforcement */}
      <section className="py-16" style={{ background: "#f8faff" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enforcement</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { level: "Warning", desc: "First-time minor violations receive a formal warning and educational notice.", color: "#F59E0B" },
              { level: "Suspension", desc: "Repeated or serious violations result in temporary account suspension (7–30 days).", color: "#EF4444" },
              { level: "Permanent Ban", desc: "Severe or fraudulent violations result in permanent removal from the platform.", color: "#7F1D1D" },
            ].map((e) => (
              <div key={e.level} className="p-5 bg-white rounded-2xl border border-gray-100">
                <div className="font-bold text-sm mb-2" style={{ color: e.color }}>{e.level}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            These Community Guidelines are subject to change. Continued use of the iGoTrend platform after updates constitutes acceptance of the revised guidelines.
            For questions, contact us at <a href="mailto:support@igotrend.com" className="font-semibold" style={{ color: "#1DCFB3" }}>support@igotrend.com</a>.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
