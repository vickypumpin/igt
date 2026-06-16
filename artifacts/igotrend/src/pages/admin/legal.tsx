import { useState } from "react";
import {
  useAdminListLegal, useAdminSaveLegalPage, getAdminListLegalQueryKey, type LegalPage,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileText, Pencil, X, Plus } from "lucide-react";

const DEFAULT_PAGES = [
  { slug: "privacy", title: "Privacy Policy" },
  { slug: "terms", title: "Terms of Service" },
  { slug: "terms-of-use", title: "Terms of Use" },
  { slug: "gdpr", title: "GDPR Policy" },
];

function EditModal({ page, onClose }: { page: { slug: string; title: string; content?: string }; onClose: () => void }) {
  const { toast } = useToast();
  const saveMutation = useAdminSaveLegalPage();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content ?? "");

  const save = () => {
    if (!title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    saveMutation.mutate({ slug: page.slug, title, content }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListLegalQueryKey() });
        toast({ title: "Legal page saved ✓" });
        onClose();
      },
      onError: () => toast({ title: "Failed to save page", variant: "destructive" }),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between flex-shrink-0">
          <div className="text-base font-bold">Edit: {page.title}</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Page title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="h-10 rounded-xl" data-testid="input-legal-title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Content (plain text or HTML)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-input px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              placeholder="Enter page content here…"
              data-testid="input-legal-content"
            />
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button
            onClick={save}
            disabled={saveMutation.isPending}
            className="flex-1 rounded-xl font-semibold"
            style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
            data-testid="btn-save-legal"
          >
            {saveMutation.isPending ? "Saving…" : "Save Page"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLegalPage() {
  const { data: pages = [], isLoading } = useAdminListLegal();
  const [editing, setEditing] = useState<{ slug: string; title: string; content?: string } | null>(null);

  const slugToPage = (slug: string) => pages.find(p => p.slug === slug);

  const allPages = DEFAULT_PAGES.map(def => {
    const existing = slugToPage(def.slug);
    return existing
      ? { ...def, content: existing.content, updatedAt: existing.updatedAt }
      : { ...def, content: undefined, updatedAt: undefined };
  });

  return (
    <AdminLayout>
      <div data-testid="page-admin-legal">
        {editing && <EditModal page={editing} onClose={() => setEditing(null)} />}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Legal Pages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage privacy policy, terms, and other legal content</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
        ) : (
          <div className="space-y-3">
            {allPages.map(page => (
              <div key={page.slug} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm flex items-center gap-4" data-testid={`legal-row-${page.slug}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{page.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {page.updatedAt
                      ? <>Last updated {new Date(page.updatedAt).toLocaleDateString()}</>
                      : <span className="text-amber-600">Not yet created — click Edit to add content</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {page.content && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline px-2"
                    >
                      Preview ↗
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(page)}
                    className="rounded-xl gap-1.5 h-8 px-3 text-xs"
                    data-testid={`btn-edit-legal-${page.slug}`}
                  >
                    {page.content ? <><Pencil className="h-3.5 w-3.5" />Edit</> : <><Plus className="h-3.5 w-3.5" />Create</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
