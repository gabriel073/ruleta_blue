const LOGO_SRC = "/assets/logo-blue_sinFondoSVG.svg";

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
        backgroundColor: "transparent",
        ...style,
      }}
    >
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
