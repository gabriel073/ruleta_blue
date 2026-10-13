import LogoMark from "./LogoMark";

export default function Logo({ animated = false, size = 160 }) {
  return (
    <LogoMark
      width={size * 2}
      height={size}
      className={animated ? "animate-logoIn" : ""}
    />
  );
}
