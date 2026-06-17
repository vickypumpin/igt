import { PublicLayout } from "@/components/layout/public-layout";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, MessageSquare, BookOpen, Mail } from "lucide-react";
import { useState } from "react";

const TEAL = "#1DCFB3";

const FAQS = [
  {
    q: "How do I get started as a brand on iGoTrend?",
    a: "Register for a brand account, complete your profile, and create your first campaign. You can then browse our creator marketplace to invite creators to your campaign.",
  },
  {
    q: "How do creators get paid?",
    a: "Creators receive payouts directly to their registered bank account once campaign milestones are approved. Payments are processed in NGN, GHS, or KES depending on your country.",
  },
  {
    q: "What is Trend AI?",
    a: "Trend AI is iGoTrend's built-in marketing intelligence assistant. Ask it anything about influencer marketing strategy, campaign advice, creator selection, or West Africa market trends — it's like having an expert advisor on call 24/7.",
  },
  {
    q: "How does the agency model work?",
    a: "Agencies can manage multiple brand clients from a single portal. They operate campaigns on behalf of their clients and earn a commission on campaign spend, managed automatically by the platform.",
  },
  {
    q: "What countries does iGoTrend support?",
    a: "iGoTrend currently supports Nigeria, Ghana, Kenya, Côte d'Ivoire, and Senegal, with more West African markets being added throughout 2026.",
  },
  {
    q: "How do I verify my creator account?",
    a: "After registering, go to your dashboard and submit a verification request under your account settings. Our team typically reviews requests within 24–48 hours.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
      >
        <span className="font-semibold text-gray-900">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" />
          : <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />}
      </button>
      {open && (
        <p className="pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#141C35] to-[#1A1440] py-20 px-6 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(29,207,179,0.15)", color: TEAL }}>
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Find answers to common questions, or reach out to our support team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: BookOpen, title: "Documentation", desc: "Guides and how-tos for every feature on the platform.", label: "Coming soon" },
              { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support team Monday – Friday, 9am – 6pm WAT.", label: "Coming soon" },
              { icon: Mail, title: "Email Support", desc: "Send us a message and we'll respond within one business day.", label: "support@igotrend.com" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="border border-gray-100 rounded-2xl p-6 text-center">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(29,207,179,0.1)" }}>
                    <Icon className="h-5 w-5" style={{ color: TEAL }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item.desc}</p>
                  <span className="text-xs font-semibold" style={{ color: TEAL }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="border border-gray-100 rounded-2xl px-6">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>

          <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: "rgba(29,207,179,0.06)", border: "1px solid rgba(29,207,179,0.15)" }}>
            <p className="font-semibold text-gray-900 mb-1">Still have questions?</p>
            <p className="text-sm text-gray-400 mb-4">Our team is happy to help. Send us an email and we'll get back to you.</p>
            <a href="mailto:support@igotrend.com"
              className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: TEAL }}>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
