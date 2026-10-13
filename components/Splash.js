import LogoMark from "./LogoMark";

export default function Splash({ onStart }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Decor />
      <div className="animate-logoIn">
        <div className="animate-idle" style={{ animationDelay: "1.2s" }}>
          <LogoMark width={300} height={150} />
        </div>
      </div>
      <p
        className="mt-3 animate-fadeIn text-lg font-semibold text-blue-700"
        style={{ animationDelay: "1.5s" }}
      >
        Ropita para los más chiquitos
      </p>
      <button
        onClick={onStart}
        className="mt-10 animate-pop rounded-full bg-blue-600 px-12 py-4 text-2xl font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-butter active:scale-95"
        style={{ animationDelay: "2.2s" }}
      >
        ¡Juguemos!
      </button>
    </section>
  );
}

function Decor() {
  const items = [
    { t: "8%", l: "10%", s: 28, d: "0s", c: "#ffe48a" },
    { t: "18%", l: "82%", s: 20, d: "0.8s", c: "#ffc9d6" },
    { t: "70%", l: "8%", s: 22, d: "1.4s", c: "#ffffff" },
    { t: "78%", l: "86%", s: 30, d: "0.4s", c: "#ffe48a" },
    { t: "42%", l: "92%", s: 16, d: "2s", c: "#ffffff" },
    { t: "50%", l: "4%", s: 18, d: "1s", c: "#ffc9d6" },
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
