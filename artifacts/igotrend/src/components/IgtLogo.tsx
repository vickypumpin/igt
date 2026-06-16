interface IgtLogoProps {
  white?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizes = {
  xs: "text-base",
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-5xl",
};

export function IgtLogo({ white = false, size = "md" }: IgtLogoProps) {
  const cls = sizes[size];
  return (
    <span className={`${cls} font-black tracking-tight select-none leading-none`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <span style={{ color: white ? "#ffffff" : "#16875C", fontStyle: "italic" }}>i</span>
      <span style={{ color: "#1DCFB3" }}>GO</span>
      <span style={{ color: white ? "rgba(255,255,255,0.92)" : "#145E42" }}>TREND</span>
    </span>
  );
}

export function IgtLogoBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
        <span className="text-white font-black text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>iG</span>
      </div>
      <IgtLogo size="sm" />
    </div>
  );
}
