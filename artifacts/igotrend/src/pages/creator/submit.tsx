import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { useCreateSubmission, useListMyInvites, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, X, Link as LinkIcon } from "lucide-react";
import { SiInstagram as SiIG, SiTiktok as SiTT, SiYoutube as SiYT, SiFacebook, SiX, SiSnapchat } from "react-icons/si";

const schema = z.object({
  campaignId: z.number({ required_error: "Select a campaign" }),
  platform: z.string().min(1, "Select platform"),
  views: z.number().optional(),
  likes: z.number().optional(),
  caption: z.string().optional(),
  screenshotUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type UploadMode = "url" | "file";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", Icon: SiIG, color: "#E1306C", bg: "rgba(225,48,108,0.1)" },
  { id: "tiktok", label: "TikTok", Icon: SiTT, color: "#333", bg: "rgba(0,0,0,0.07)" },
  { id: "youtube", label: "YouTube", Icon: SiYT, color: "#CC0000", bg: "rgba(255,0,0,0.1)" },
  { id: "facebook", label: "Facebook", Icon: SiFacebook, color: "#3B5998", bg: "rgba(59,89,152,0.1)" },
  { id: "twitter", label: "Twitter / X", Icon: SiX, color: "#1DA1F2", bg: "rgba(29,161,242,0.1)" },
  { id: "snapchat", label: "Snapchat", Icon: SiSnapchat, color: "#B8A000", bg: "rgba(255,252,0,0.15)" },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SubmitPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { data: invites = [] } = useListMyInvites({ status: "active" }, { query: { queryKey: getListMyInvitesQueryKey({ status: "active" }) } });
  const submitMutation = useCreateSubmission();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { screenshotUrl: "", platform: "", caption: "" },
  });

  const selectedPlatform = form.watch("platform");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast({ title: "File too large", description: "Maximum 10MB", variant: "destructive" }); return; }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) setFilePreview(URL.createObjectURL(file));
    else setFilePreview(null);
  };

  const clearFile = () => { setSelectedFile(null); setFilePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const onSubmit = async (values: FormData) => {
    if (uploadMode === "file" && !selectedFile) { toast({ title: "No file selected", variant: "destructive" }); return; }
    if (uploadMode === "url" && !values.screenshotUrl) { toast({ title: "URL required", variant: "destructive" }); return; }
    let fileData: string | null = null, fileName: string | null = null, fileType: string | null = null;
    if (uploadMode === "file" && selectedFile) { fileData = await fileToBase64(selectedFile); fileName = selectedFile.name; fileType = selectedFile.type; }
    submitMutation.mutate({ data: { campaignId: values.campaignId, screenshotUrl: uploadMode === "url" ? (values.screenshotUrl ?? null) : null, fileData, fileName, fileType, platform: values.platform, views: values.views ?? null, likes: values.likes ?? null, caption: values.caption ?? null } }, {
      onSuccess: () => { toast({ title: "Submission sent! ✅", description: "Your content has been submitted for review." }); form.reset(); clearFile(); queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey({ status: "active" }) }); },
      onError: (err: unknown) => { const msg = (err as { data?: { error?: string } })?.data?.error ?? "Please try again."; toast({ title: "Submission failed", description: msg, variant: "destructive" }); },
    });
  };

  return (
    <CreatorLayout>
      <div className="max-w-lg" data-testid="page-submit">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Submit Content</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit your proof of content for review</p>
        </div>

        {!invites.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border/60 shadow-sm">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
              <Upload className="h-7 w-7" style={{ color: "#1DCFB3" }} />
            </div>
            <p className="text-sm font-medium">No active campaigns</p>
            <p className="text-xs text-muted-foreground mt-1">Accept an invite first to submit content.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="campaignId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Campaign</FormLabel>
                    <FormControl>
                      <select {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-campaign">
                        <option value="">Select campaign…</option>
                        {invites.map(inv => <option key={inv.id} value={inv.campaignId}>{inv.campaign?.name} — {inv.campaign?.sponsor}</option>)}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Platform selector */}
                <div>
                  <label className="text-sm font-semibold block mb-2">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORMS.map(({ id, label, Icon, color, bg }) => (
                      <button key={id} type="button"
                        onClick={() => form.setValue("platform", id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                        style={selectedPlatform === id ? { background: bg, color, border: `1.5px solid ${color}40` } : { border: "1.5px solid rgba(0,0,0,0.1)", color: "#6b7280" }}
                        data-testid={`platform-${id}`}>
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                  {form.formState.errors.platform && <p className="text-xs text-destructive mt-1">{form.formState.errors.platform.message}</p>}
                </div>

                {/* Content proof */}
                <div>
                  <p className="text-sm font-semibold mb-2">Content proof</p>
                  <div className="flex gap-2 mb-3">
                    <button type="button" onClick={() => setUploadMode("url")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={uploadMode === "url" ? { background: "rgba(29,207,179,0.12)", color: "#0FA88E", border: "1.5px solid rgba(29,207,179,0.35)" } : { border: "1.5px solid rgba(0,0,0,0.1)", color: "#6b7280" }}>
                      <LinkIcon className="h-3.5 w-3.5" /> Post URL
                    </button>
                    <button type="button" onClick={() => setUploadMode("file")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={uploadMode === "file" ? { background: "rgba(29,207,179,0.12)", color: "#0FA88E", border: "1.5px solid rgba(29,207,179,0.35)" } : { border: "1.5px solid rgba(0,0,0,0.1)", color: "#6b7280" }}>
                      <FileImage className="h-3.5 w-3.5" /> Upload screenshot
                    </button>
                  </div>

                  {uploadMode === "url" ? (
                    <FormField control={form.control} name="screenshotUrl" render={({ field }) => (
                      <FormItem>
                        <FormControl><Input {...field} placeholder="https://instagram.com/p/…" className="h-10 rounded-xl" data-testid="input-url" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : (
                    <div>
                      {!selectedFile ? (
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed rounded-2xl py-10 flex flex-col items-center gap-2 transition-colors hover:border-primary/40"
                          style={{ borderColor: "rgba(29,207,179,0.3)" }}
                          data-testid="upload-zone">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                            <Upload className="h-5 w-5" style={{ color: "#1DCFB3" }} />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: "#1DCFB3" }}>Click to upload screenshot</span>
                          <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10 MB</span>
                        </button>
                      ) : (
                        <div className="border border-border/60 rounded-xl p-3 flex items-center gap-3" data-testid="file-preview">
                          {filePreview ? <img src={filePreview} alt="Preview" className="h-14 w-14 object-cover rounded-lg" /> : <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"><FileImage className="h-6 w-6 text-muted-foreground" /></div>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <button type="button" onClick={clearFile} className="text-muted-foreground hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} data-testid="input-file" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="views" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-xs">Views</FormLabel><FormControl><Input {...field} type="number" className="h-10 rounded-xl" onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} data-testid="input-views" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="likes" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold text-xs">Likes</FormLabel><FormControl><Input {...field} type="number" className="h-10 rounded-xl" onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} data-testid="input-likes" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="caption" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-xs">Caption used <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl><Input {...field} placeholder="The caption you used on the post" className="h-10 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full h-11 rounded-xl font-bold text-base" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} disabled={submitMutation.isPending} data-testid="button-submit">
                  {submitMutation.isPending ? "Submitting…" : "Submit content ✓"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </CreatorLayout>
  );
}
