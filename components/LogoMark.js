const LOGO_MASK = "url('/assets/logo-blue-azul.png')";

export default function LogoMark({ width = 220, height = 90, round = false, className = "", style }) {
  return (
    <div
      role="img"
      aria-label="Blue"
      className={`relative ${className}`}
      style={{
        width,
        height,
        boxSizing: "border-box",
        padding: round ? "8%" : 8,
        overflow: "hidden",
        borderRadius: round ? "50%" : 12,
        backgroundColor: "#dcecff",
        filter: "drop-shadow(0 8px 14px rgba(35,78,146,0.35)) drop-shadow(0 0 18px rgba(143,189,245,0.7))",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#234e92",
          WebkitMaskImage: LOGO_MASK,
          maskImage: LOGO_MASK,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
