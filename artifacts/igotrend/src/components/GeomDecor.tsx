interface GeomDecorProps {
  variant?: "purple" | "teal" | "dark";
}

export function GeomDecor({ variant = "purple" }: GeomDecorProps) {
  const teal = "#1DCFB3";
  const opacity = variant === "dark" ? 0.5 : 0.8;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Top-left teal triangle up */}
      <svg className="absolute" style={{ top: "9%", left: "7%", opacity }} width="15" height="13" viewBox="0 0 15 13"><polygon points="7.5,0 15,13 0,13" fill={teal} /></svg>
      {/* Top-right orange diamond */}
      <svg className="absolute" style={{ top: "7%", right: "11%", opacity: opacity * 0.9 }} width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" fill="#FF8C42" transform="rotate(45 7 7)" /></svg>
      {/* Mid-left white outline triangle */}
      <svg className="absolute" style={{ top: "38%", left: "12%", opacity: 0.18 }} width="42" height="37" viewBox="0 0 42 37"><polygon points="21,0 42,37 0,37" fill="none" stroke="white" strokeWidth="2.5" /></svg>
      {/* Mid-right coral circle */}
      <svg className="absolute" style={{ top: "44%", right: "7%", opacity: opacity * 0.85 }} width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#E05878" /></svg>
      {/* Center yellow circle */}
      <svg className="absolute" style={{ top: "62%", left: "5%", opacity: opacity * 0.85 }} width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#F9C74F" /></svg>
      {/* Teal right-pointing triangle */}
      <svg className="absolute" style={{ top: "58%", left: "4%", opacity: opacity * 0.7 }} width="13" height="13" viewBox="0 0 13 13"><polygon points="0,0 13,6.5 0,13" fill={teal} /></svg>
      {/* Bottom-right white outline triangle */}
      <svg className="absolute" style={{ bottom: "22%", right: "14%", opacity: 0.18 }} width="38" height="34" viewBox="0 0 38 34"><polygon points="19,0 38,34 0,34" fill="none" stroke="white" strokeWidth="2.5" /></svg>
      {/* Teal down-triangle */}
      <svg className="absolute" style={{ top: "72%", right: "28%", opacity: opacity * 0.65 }} width="13" height="11" viewBox="0 0 13 11"><polygon points="0,0 13,0 6.5,11" fill={teal} /></svg>
      {/* Bottom-right orange small diamond */}
      <svg className="absolute" style={{ bottom: "14%", right: "8%", opacity: opacity * 0.7 }} width="11" height="11" viewBox="0 0 11 11"><rect x="1.5" y="1.5" width="8" height="8" fill="#FF8C42" transform="rotate(45 5.5 5.5)" /></svg>
      {/* Small teal dot top center-right */}
      <svg className="absolute" style={{ top: "28%", right: "32%", opacity: opacity * 0.5 }} width="9" height="9" viewBox="0 0 9 9"><circle cx="4.5" cy="4.5" r="4.5" fill={teal} /></svg>
      {/* Bottom-left pink dot */}
      <svg className="absolute" style={{ bottom: "35%", left: "3%", opacity: opacity * 0.6 }} width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#E05878" /></svg>
    </div>
  );
}
