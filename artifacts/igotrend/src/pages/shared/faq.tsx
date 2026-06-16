import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useListFaqs, getListFaqsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import BrandLayout from "@/components/layout/brand-layout";
import CreatorLayout from "@/components/layout/creator-layout";

function FaqAccordion({ question, answer, open, onToggle }: {
  question: string; answer: string; open: boolean; onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
        data-testid="faq-item"
      >
        <span className="text-sm font-semibold">{question}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { user } = useAuth();
  const { data: faqs = [], isLoading } = useListFaqs({ query: { queryKey: getListFaqsQueryKey() } });
  const [openId, setOpenId] = useState<number | null>(null);

  const Layout = user?.role === "creator" ? CreatorLayout : BrandLayout;

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category ?? "general";
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(faq);
    return acc;
  }, {});

  return (
    <Layout>
      <div data-testid="page-faq">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">FAQ</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Answers to frequently asked questions</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>
        ) : !faqs.length ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
              <HelpCircle className="h-7 w-7" style={{ color: "#1DCFB3" }} />
            </div>
            <p className="text-sm font-medium">No FAQs yet</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon for answers to common questions</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">{category}</div>
                <div className="space-y-2">
                  {items.map(faq => (
                    <FaqAccordion
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      open={openId === faq.id}
                      onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
