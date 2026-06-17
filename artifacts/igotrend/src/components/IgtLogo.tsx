interface IgtLogoProps {
  white?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const iconHeightMap = {
  xs: 20,
  sm: 26,
  md: 34,
  lg: 44,
  xl: 64,
};

const textSizeMap = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
};

export function IgtLogo({ white = false, size = "md" }: IgtLogoProps) {
  const iconH = iconHeightMap[size];
  const textCls = textSizeMap[size];

  return (
    <span className="flex items-center gap-2 select-none leading-none" style={{ lineHeight: 1 }}>
      {/* Spinning target icon from the brand logo */}
      <img
        src="/logo-icon.png"
        alt=""
        height={iconH}
        style={{ height: iconH, width: "auto", flexShrink: 0 }}
        draggable={false}
      />
      {/* Crisp CSS wordmark */}
      <span
        className={`${textCls} font-black tracking-tight`}
        style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}
      >
        <span style={{ color: white ? "#ffffff" : "#E91E8C", fontStyle: "italic" }}>i</span>
        <span style={{ color: white ? "rgba(255,255,255,0.9)" : "#FF8C00" }}>G</span>
        <span style={{ color: white ? "rgba(255,255,255,0.9)" : "#1DCFB3" }}>o</span>
        <span style={{ color: white ? "#ffffff" : "#6B2FCE" }}>T</span>
        <span style={{ color: white ? "rgba(255,255,255,0.85)" : "#1565C0" }}>R</span>
        <span style={{ color: white ? "rgba(255,255,255,0.85)" : "#1DCFB3" }}>E</span>
        <span style={{ color: white ? "rgba(255,255,255,0.85)" : "#16875C" }}>N</span>
        <span style={{ color: white ? "rgba(255,255,255,0.85)" : "#1DCFB3" }}>d</span>
      </span>
    </span>
  );
}

export function IgtLogoBadge() {
  return (
    <span className="flex items-center gap-2 select-none" style={{ lineHeight: 1 }}>
      <img
        src="/logo-icon.png"
        alt=""
        height={32}
        style={{ height: 32, width: "auto", flexShrink: 0 }}
        draggable={false}
      />
      <span
        className="text-lg font-black tracking-tight"
        style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}
      >
        <span style={{ color: "#E91E8C", fontStyle: "italic" }}>i</span>
        <span style={{ color: "#FF8C00" }}>G</span>
        <span style={{ color: "#1DCFB3" }}>o</span>
        <span style={{ color: "#6B2FCE" }}>T</span>
        <span style={{ color: "#1565C0" }}>R</span>
        <span style={{ color: "#1DCFB3" }}>E</span>
        <span style={{ color: "#16875C" }}>N</span>
        <span style={{ color: "#1DCFB3" }}>d</span>
      </span>
    </span>
  );
}
