import { Construction } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export default function ComingSoonPage({ title = "Coming Soon", description = "This section is under construction and will be available soon." }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(29,207,179,0.1)" }}>
        <Construction className="h-8 w-8" style={{ color: "#1DCFB3" }} />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
