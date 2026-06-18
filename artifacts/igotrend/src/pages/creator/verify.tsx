import { useState, useRef } from "react";
import { useGetMyKycRequest, useSubmitKycRequest, getMyKycRequestQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ShieldX, Clock, Upload, CheckCircle2 } from "lucide-react";

const ID_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "drivers_licence", label: "Driver's Licence" },
];

const STATUS_CONFIG = {
  pending:  { color: "#D97706", bg: "rgba(245,158,11,0.1)",  Icon: Clock,         label: "Pending Review" },
  approved: { color: "#059669", bg: "rgba(16,185,129,0.1)",  Icon: CheckCircle2,  label: "Verified" },
  rejected: { color: "#DC2626", bg: "rgba(239,68,68,0.1)",   Icon: ShieldX,       label: "Not Approved" },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function VerifyPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: existing, isLoading, error } = useGetMyKycRequest({
    query: { retry: false },
  });
  const submitMutation = useSubmitKycRequest();

  const [form, setForm] = useState({ legalName: "", country: "", idType: "national_id", idNumber: "" });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const notFound = (error as { status?: number })?.status === 404 || (!isLoading && !existing);
  const canSubmit = !existing || existing.status === "rejected";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setDocFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.legalName.trim() || !form.country.trim() || !form.idNumber.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (!docFile) {
      toast({ title: "Please upload an ID document to continue", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const documentUrl = await fileToBase64(docFile);
      await submitMutation.mutateAsync({ ...form, documentUrl });
      queryClient.invalidateQueries({ queryKey: getMyKycRequestQueryKey() });
      toast({ title: "Verification request submitted! 🎉" });
      setForm({ legalName: "", country: "", idType: "national_id", idNumber: "" });
      setDocFile(null);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Submission failed";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CreatorLayout>
      <div data-testid="page-creator-verify" className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" style={{ color: "#1DCFB3" }} />
            Identity Verification
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit your ID to get a verified badge on your profile</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : existing && !canSubmit ? (
          /* Status card — pending or approved */
          (() => {
            const cfg = STATUS_CONFIG[existing.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
            const { Icon } = cfg;
            return (
              <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: cfg.bg }}>
                    <Icon className="h-7 w-7" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{cfg.label}</div>
                    <div className="text-xs text-muted-foreground">Submitted {new Date(existing.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Legal Name</div>
                    <div className="font-semibold">{existing.legalName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Country</div>
                    <div className="font-semibold">{existing.country}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">ID Type</div>
                    <div className="font-semibold capitalize">{existing.idType.replace("_", " ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">ID Number</div>
                    <div className="font-semibold font-mono">{existing.idNumber}</div>
                  </div>
                </div>
                {existing.status === "pending" && (
                  <p className="text-xs text-muted-foreground mt-4 bg-amber-50 rounded-xl p-3 border border-amber-100">
                    Your request is being reviewed by our team. We'll notify you once it's processed.
                  </p>
                )}
                {existing.status === "approved" && (
                  <p className="text-xs text-emerald-700 mt-4 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    Your identity is verified. You now have a verified badge visible across the platform!
                  </p>
                )}
              </div>
            );
          })()
        ) : (
          /* Form — no request or rejected */
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            {existing?.status === "rejected" && (
              <div className="mb-5 p-3 rounded-xl text-xs text-red-700 bg-red-50 border border-red-100">
                Your previous verification request was not approved. Please correct the information and resubmit.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">Full Legal Name <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="As it appears on your ID document"
                  value={form.legalName}
                  onChange={e => setForm(f => ({ ...f, legalName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">Country <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="e.g. Nigeria"
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">ID Type <span className="text-red-500">*</span></label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
                  value={form.idType}
                  onChange={e => setForm(f => ({ ...f, idType: e.target.value }))}
                >
                  {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">ID Number <span className="text-red-500">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="Enter the number shown on your ID"
                  value={form.idNumber}
                  onChange={e => setForm(f => ({ ...f, idNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">Upload ID Document</label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-300 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
                  {docFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Upload className="h-4 w-4" style={{ color: "#1DCFB3" }} />
                      <span className="font-medium text-foreground">{docFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <Upload className="h-6 w-6" />
                      <span className="text-sm">Click to upload image or PDF</span>
                      <span className="text-xs">PNG, JPG, PDF up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                data-testid="btn-submit-kyc"
              >
                {submitting ? "Submitting…" : "Submit Verification Request"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </CreatorLayout>
  );
}
