interface IgtLogoProps {
  white?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const heightMap = {
  xs: 22,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72,
};

export function IgtLogo({ white = false, size = "md" }: IgtLogoProps) {
  const h = heightMap[size];
  const src = white ? "/logo-white.png" : "/logo.png";
  return (
    <img
      src={src}
      alt="iGoTrend"
      height={h}
      style={{ height: h, width: "auto", display: "inline-block", userSelect: "none" }}
      draggable={false}
    />
  );
}

export function IgtLogoBadge() {
  return (
    <img
      src="/logo.png"
      alt="iGoTrend"
      height={36}
      style={{ height: 36, width: "auto", display: "inline-block", userSelect: "none" }}
      draggable={false}
    />
  );
}
