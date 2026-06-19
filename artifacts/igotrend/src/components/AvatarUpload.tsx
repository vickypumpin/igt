import { useRef, useState, useCallback } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentUrl: string;
  initials?: string;
  onUpload: (url: string) => void;
  size?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_ATTR = ACCEPTED_TYPES.join(",");

export function AvatarUpload({ currentUrl, initials = "?", onUpload, size = 80 }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setProgress(10);
    try {
      const urlRes = await fetch("/api/account/avatar-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });

      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Failed to get upload URL");
      }

      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
      setProgress(40);

      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!putRes.ok) throw new Error("Failed to upload to storage");

      setProgress(100);
      const finalUrl = `/api/storage${objectPath}`;
      onUpload(finalUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [onUpload, toast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please select a JPEG, PNG, or WEBP image.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 5 MB.", variant: "destructive" });
      return;
    }

    await uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex-shrink-0" style={{ width: size, height: size }}>
      <button
        type="button"
        className="relative group rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DCFB3]"
        style={{ width: size, height: size }}
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        title="Change photo"
        data-testid="btn-avatar-upload"
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="avatar"
            className="w-full h-full object-cover"
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1DCFB3, #6B2FCE)",
              fontSize: size * 0.35,
            }}
          >
            {initials.toUpperCase()}
          </div>
        )}

        {isUploading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ borderRadius: "50%", background: "rgba(0,0,0,0.5)" }}
          >
            <Loader2 className="h-5 w-5 text-white animate-spin" />
            <span className="text-white text-xs mt-1 font-semibold">{progress}%</span>
          </div>
        )}

        {!isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderRadius: "50%", background: "rgba(0,0,0,0.45)" }}
          >
            <Camera className="h-5 w-5 text-white" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ATTR}
        className="hidden"
        onChange={handleFileChange}
        data-testid="input-avatar-file"
      />
    </div>
  );
}
