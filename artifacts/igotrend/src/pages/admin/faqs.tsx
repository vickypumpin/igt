import { useState } from "react";
import {
  useAdminListFaqs, useAdminCreateFaq, useAdminUpdateFaq, useAdminDeleteFaq,
  getAdminListFaqsQueryKey, type Faq,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";

function FaqModal({
  initial,
  onClose,
}: {
  initial?: Faq;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const createMutation = useAdminCreateFaq();
  const updateMutation = useAdminUpdateFaq();
  const [form, setForm] = useState({
    question: initial?.question ?? "",
    answer: initial?.answer ?? "",
    category: initial?.category ?? "general",
    sortOrder: initial?.sortOrder ?? 0,
  });

  const save = () => {
    if (!form.question || !form.answer) {
      toast({ title: "Question and answer are required", variant: "destructive" }); return;
    }
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() });
      toast({ title: initial ? "FAQ updated ✓" : "FAQ created ✓" });
      onClose();
    };
    const onError = () => toast({ title: "Failed to save FAQ", variant: "destructive" });
    if (initial) {
      updateMutation.mutate({ id: initial.id, ...form }, { onSuccess, onError });
    } else {
      createMutation.mutate(form, { onSuccess, onError });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between">
          <div className="text-base font-bold">{initial ? "Edit FAQ" : "New FAQ"}</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Question</label>
            <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className="h-10 rounded-xl" placeholder="e.g. How do I get started?" data-testid="input-faq-question" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Answer</label>
            <textarea
              value={form.answer}
              onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
              rows={4}
              className="w-full rounded-xl border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Write a detailed answer…"
              data-testid="input-faq-answer"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="h-10 rounded-xl" placeholder="general" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Sort order</label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} className="h-10 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button
            onClick={save}
            disabled={isPending}
            className="flex-1 rounded-xl font-semibold"
            style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
            data-testid="btn-save-faq"
          >
            {isPending ? "Saving…" : initial ? "Update FAQ" : "Create FAQ"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const { data: faqs = [], isLoading } = useAdminListFaqs();
  const deleteMutation = useAdminDeleteFaq();
  const toggleMutation = useAdminUpdateFaq();
  const [modal, setModal] = useState<{ open: boolean; faq?: Faq }>({ open: false });

  const handleDelete = (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() }); toast({ title: "FAQ deleted" }); },
    });
  };

  const handleToggle = (faq: Faq) => {
    toggleMutation.mutate({ id: faq.id, isActive: !faq.isActive }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() }),
    });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-faqs">
        {modal.open && <FaqModal initial={modal.faq} onClose={() => setModal({ open: false })} />}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">FAQs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{faqs.length} questions</p>
          </div>
          <Button
            onClick={() => setModal({ open: true })}
            className="rounded-xl gap-2 font-semibold"
            style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
            data-testid="btn-add-faq"
          >
            <Plus className="h-4 w-4" />New FAQ
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !faqs.length ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.12)" }}>
              <HelpCircle className="h-7 w-7" style={{ color: "#FF8C42" }} />
            </div>
            <p className="text-sm font-medium">No FAQs yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first FAQ to help users find answers</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Question</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {faqs.map(faq => (
                  <tr key={faq.id} className="hover:bg-muted/30 transition-colors" data-testid={`faq-row-${faq.id}`}>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold truncate">{faq.question}</div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">{faq.answer}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-muted text-muted-foreground">{faq.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{faq.sortOrder}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleToggle(faq)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                        style={faq.isActive ? { background: "rgba(16,185,129,0.12)", color: "#059669" } : { background: "rgba(0,0,0,0.06)", color: "#6B7280" }}>
                        {faq.isActive ? <><Eye className="h-3 w-3" />Active</> : <><EyeOff className="h-3 w-3" />Hidden</>}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setModal({ open: true, faq })} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" data-testid={`btn-edit-faq-${faq.id}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(faq.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" data-testid={`btn-delete-faq-${faq.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
