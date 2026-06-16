import { useRoute } from "wouter";
import { useLegalPage } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertCircle } from "lucide-react";

const SLUG_MAP: Record<string, string> = {
  "privacy": "Privacy Policy",
  "terms": "Terms of Service",
  "terms-of-use": "Terms of Use",
  "gdpr": "GDPR Policy",
};

function LegalPageContent({ slug }: { slug: string }) {
  const { data: page, isLoading, isError } = useLegalPage(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="space-y-2 mt-6">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-4 rounded w-full" />)}</div>
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-amber-50">
          <AlertCircle className="h-7 w-7 text-amber-500" />
        </div>
        <h2 className="text-lg font-bold mb-2">{SLUG_MAP[slug] ?? "Legal Page"}</h2>
        <p className="text-muted-foreground text-sm">This page is being updated. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2">{page.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <div
        className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}

export default function LegalPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug ?? "";

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-8 text-muted-foreground text-sm">
          <FileText className="h-4 w-4" />
          <span>Legal</span>
          <span>/</span>
          <span className="font-medium text-foreground">{SLUG_MAP[slug] ?? slug}</span>
        </div>
        <LegalPageContent slug={slug} />
      </div>
    </PublicLayout>
  );
}
