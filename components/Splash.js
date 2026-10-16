import LogoMark from "./LogoMark";

export default function Splash({ onStart }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#e8d3ac] px-6 text-center">
      <Decor />
      <div className="animate-logoIn">
        <div className="animate-idle" style={{ animationDelay: "1.2s" }}>
          <LogoMark width="min(600px, 90vw)" height="min(300px, 45vw)" />
        </div>
      </div>
      <p
        className="mt-3 animate-fadeIn text-lg font-semibold text-[#343a35]"
        style={{ animationDelay: "1.5s" }}
      >
        Ropa Bebé y Niños
      </p>
      <button
        onClick={onStart}
        className="mt-10 animate-pop rounded-full bg-[#879b82] px-12 py-4 text-2xl font-extrabold text-white shadow-lg shadow-[#879b82]/30 transition hover:scale-105 hover:bg-[#71856d] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5b99f] active:scale-95"
        style={{ animationDelay: "2.2s" }}
      >
        ¡Juguemos!
      </button>
    </section>
  );
}

function Decor() {
  const items = [
    { t: "8%", l: "10%", s: 28, d: "0s", c: "#c5b99f" },
    { t: "18%", l: "82%", s: 20, d: "0.8s", c: "#a9b7a3" },
    { t: "70%", l: "8%", s: 22, d: "1.4s", c: "#d9d2c4" },
    { t: "78%", l: "86%", s: 30, d: "0.4s", c: "#c5b99f" },
    { t: "42%", l: "92%", s: 16, d: "2s", c: "#d9d2c4" },
    { t: "50%", l: "4%", s: 18, d: "1s", c: "#a9b7a3" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {items.map((it, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={it.s}
          height={it.s}
          className="absolute animate-float"
          style={{ top: it.t, left: it.l, animationDelay: it.d }}
        >
          <path d="M12 1 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill={it.c} />
        </svg>
      ))}
    </div>
  );
}
