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

const PLATFORMS = ["instagram", "tiktok", "youtube", "facebook", "twitter", "snapchat"];

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: FormData) => {
    if (uploadMode === "file" && !selectedFile) {
      toast({ title: "No file selected", description: "Upload a screenshot or switch to URL mode", variant: "destructive" });
      return;
    }
    if (uploadMode === "url" && !values.screenshotUrl) {
      toast({ title: "URL required", description: "Enter the URL of your content post", variant: "destructive" });
      return;
    }

    let fileData: string | null = null;
    let fileName: string | null = null;
    let fileType: string | null = null;

    if (uploadMode === "file" && selectedFile) {
      fileData = await fileToBase64(selectedFile);
      fileName = selectedFile.name;
      fileType = selectedFile.type;
    }

    submitMutation.mutate({
      data: {
        campaignId: values.campaignId,
        screenshotUrl: uploadMode === "url" ? (values.screenshotUrl ?? null) : null,
        fileData,
        fileName,
        fileType,
        platform: values.platform,
        views: values.views ?? null,
        likes: values.likes ?? null,
        caption: values.caption ?? null,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Submission sent!", description: "Your content has been submitted for review." });
        form.reset();
        clearFile();
        queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey({ status: "active" }) });
      },
      onError: (err: unknown) => {
        const msg = (err as { data?: { error?: string } })?.data?.error ?? "Please try again.";
        toast({ title: "Submission failed", description: msg, variant: "destructive" });
      },
    });
  };

  return (
    <CreatorLayout>
      <div className="max-w-lg" data-testid="page-submit">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Submit Content</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit your proof of content for review</p>
        </div>

        {!invites.length ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">No active campaigns to submit for.</p>
            <p className="text-xs text-muted-foreground mt-1">Accept an invite first.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField control={form.control} name="campaignId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign</FormLabel>
                  <FormControl>
                    <select {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-campaign">
                      <option value="">Select campaign</option>
                      {invites.map(inv => <option key={inv.id} value={inv.campaignId}>{inv.campaign?.name} — {inv.campaign?.sponsor}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="platform" render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-platform">
                      <option value="">Select platform</option>
                      {PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div>
                <p className="text-sm font-medium mb-2">Content proof</p>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setUploadMode("url")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-xs font-medium transition-colors ${uploadMode === "url" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    <LinkIcon className="h-3.5 w-3.5" /> Post URL
                  </button>
                  <button type="button" onClick={() => setUploadMode("file")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-xs font-medium transition-colors ${uploadMode === "file" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    <FileImage className="h-3.5 w-3.5" /> Upload screenshot
                  </button>
                </div>

                {uploadMode === "url" ? (
                  <FormField control={form.control} name="screenshotUrl" render={({ field }) => (
                    <FormItem>
                      <FormControl><Input {...field} placeholder="https://instagram.com/p/..." data-testid="input-url" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ) : (
                  <div>
                    {!selectedFile ? (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg py-8 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors" data-testid="upload-zone">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload screenshot</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10 MB</span>
                      </button>
                    ) : (
                      <div className="border border-border rounded-lg p-3 flex items-center gap-3" data-testid="file-preview">
                        {filePreview ? (
                          <img src={filePreview} alt="Preview" className="h-14 w-14 object-cover rounded" />
                        ) : (
                          <div className="h-14 w-14 bg-muted rounded flex items-center justify-center">
                            <FileImage className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button type="button" onClick={clearFile} className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} data-testid="input-file" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="views" render={({ field }) => (
                  <FormItem><FormLabel>Views</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} data-testid="input-views" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="likes" render={({ field }) => (
                  <FormItem><FormLabel>Likes</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} data-testid="input-likes" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="caption" render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption used <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input {...field} placeholder="The caption you used on the post" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full" disabled={submitMutation.isPending} data-testid="button-submit">
                {submitMutation.isPending ? "Submitting..." : "Submit content"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </CreatorLayout>
  );
}
