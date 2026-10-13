"use client";
import { useEffect, useRef, useState } from "react";
import { PRIZES, pickPrizeIndex } from "@/lib/prizes";
import LogoMark from "./LogoMark";

const SIZE = 400;
const C = SIZE / 2;
const R = 180; // radio de los gajos (grandes: casi todo el diámetro)
const N = PRIZES.length;
const SEG = 360 / N;
const SPIN_MS = 5200;
const TILT = 30; // inclinación 3D en grados
const DEPTH = 22; // grosor de la rueda en px
const BULBS = 24;

function polar(angleDeg, radius) {
  const a = (angleDeg * Math.PI) / 180; // 0° = arriba, sentido horario
  return [C + radius * Math.sin(a), C - radius * Math.cos(a)];
}

function segmentPath(i) {
  const [x1, y1] = polar(i * SEG, R);
  const [x2, y2] = polar((i + 1) * SEG, R);
  return `M ${C} ${C} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;
}

function cubicBezierCoordinate(t, firstControl, secondControl) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * firstControl + 3 * inverse * t * t * secondControl + t * t * t;
}

function spinProgress(progress) {
  let low = 0;
  let high = 1;
  let parameter = progress;
  for (let iteration = 0; iteration < 12; iteration += 1) {
    parameter = (low + high) / 2;
    if (cubicBezierCoordinate(parameter, 0.12, 0.1) < progress) low = parameter;
    else high = parameter;
  }
  return cubicBezierCoordinate(parameter, 0.62, 1);
}

// Texto del gajo: horizontal si es corto (5% OFF), en vertical (a lo largo del radio) si no entra.
function SegmentLabel({ prize, index }) {
  const angle = index * SEG + SEG / 2;
  const short = prize.label[0].length <= 4;
  if (short) {
    return (
      <g transform={`rotate(${angle} ${C} ${C})`}>
        <text x={C} y={C - R * 0.62} textAnchor="middle" fill={prize.ink} fontWeight="900" fontSize="36" style={{ paintOrder: "stroke" }} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
          {prize.label[0]}
        </text>
        <text x={C} y={C - R * 0.62 + 24} textAnchor="middle" fill={prize.ink} fontWeight="800" fontSize="19" letterSpacing="2">
          {prize.label[1]}
        </text>
      </g>
    );
  }
  const maxLen = Math.max(prize.label[0].length, prize.label[1].length);
  const size = Math.min(18, 122 / (maxLen * 0.6));
  const y0 = C - R * 0.63; // centro del texto sobre el radio
  return (
    <g transform={`rotate(${angle} ${C} ${C})`}>
      {prize.label.map((line, k) => {
        const x = C + (k === 0 ? -size * 0.7 : size * 0.7);
        return (
          <text
            key={k}
            x={x}
            y={y0}
            transform={`rotate(-90 ${x} ${y0})`}
            textAnchor="middle"
            dominantBaseline="central"
            fill={prize.ink}
            fontWeight={k === 0 ? 900 : 800}
            fontSize={size}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

export default function Wheel({ onResult, disabled }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [pointerTick, setPointerTick] = useState(0);
  const [pointerDuration, setPointerDuration] = useState(120);
  const timer = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => () => {
    clearTimeout(timer.current);
    cancelAnimationFrame(animationFrame.current);
  }, []);

  function spin() {
    if (spinning || disabled) return;
    const idx = pickPrizeIndex();
    const center = idx * SEG + SEG / 2;
    const jitter = (Math.random() - 0.5) * SEG * 0.6;
    const base = rotation - (rotation % 360);
    const next = base + 360 * 6 + (360 - center) + jitter;
    setSpinning(true);
    setRotation(next);
    const startedAt = performance.now();
    let previousSector = Math.floor(rotation / SEG);
    let previousTickAt = startedAt;
    const followWheel = (timestamp) => {
      const elapsed = Math.min(timestamp - startedAt, SPIN_MS);
      const progress = spinProgress(elapsed / SPIN_MS);
      const currentRotation = rotation + (next - rotation) * progress;
      const currentSector = Math.floor(currentRotation / SEG);
      const passedSectors = currentSector - previousSector;

      if (passedSectors > 0) {
        const timePerSector = (timestamp - previousTickAt) / passedSectors;
        setPointerDuration(Math.min(420, Math.max(90, timePerSector * 1.2)));
        setPointerTick((tick) => tick + passedSectors);
        previousSector = currentSector;
        previousTickAt = timestamp;
      }

      if (elapsed < SPIN_MS) animationFrame.current = requestAnimationFrame(followWheel);
    };
    animationFrame.current = requestAnimationFrame(followWheel);
    timer.current = setTimeout(() => {
      setSpinning(false);
      onResult(PRIZES[idx]);
    }, SPIN_MS + 150);
  }

  return (
    <div className="flex flex-col items-center">
      {/* escena 3D */}
      <div className="relative w-[min(92vw,32rem)] pt-16" style={{ perspective: "1100px" }}>
        {/* sombra en el piso */}
        <div
          aria-hidden
          className="absolute left-[8%] right-[8%] rounded-[50%] bg-blue-900/40 blur-2xl"
          style={{ bottom: "-2%", height: "16%" }}
        />

        <div
          className="relative aspect-square w-full"
          style={{ transformStyle: "preserve-3d", transform: `rotateX(${TILT}deg)` }}
        >
          {/* grosor de la rueda: capas apiladas hacia atrás */}
          {Array.from({ length: DEPTH }).map((_, k) => {
            const t = k / (DEPTH - 1);
            const shade = Math.round(78 - t * 50); // de #4a7fc6 a más oscuro
            return (
              <div
                key={k}
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  transform: `translateZ(${-(k + 1)}px)`,
                  background: `hsl(216 60% ${shade * 0.55}%)`,
                }}
              />
            );
          })}

          {/* cara de la rueda */}
          <div className="absolute inset-0" style={{ transform: "translateZ(0.5px)" }}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" role="img" aria-label="Ruleta de premios de Blue">
              <defs>
                <radialGradient id="rimGrad" cx="50%" cy="35%" r="75%">
                  <stop offset="0%" stopColor="#5e9bea" />
                  <stop offset="55%" stopColor="#2a63b8" />
                  <stop offset="100%" stopColor="#1b3459" />
                </radialGradient>
                <radialGradient id="faceShade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="100%" stopColor="#1b3459" stopOpacity="0.28" />
                </radialGradient>
                <linearGradient id="gloss" x1="0" y1="0" x2="0.6" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="bulb" cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#ffe48a" />
                  <stop offset="100%" stopColor="#e6a817" />
                </radialGradient>
              </defs>

              {/* aro exterior */}
              <circle cx={C} cy={C} r={C - 1} fill="url(#rimGrad)" />
              <circle cx={C} cy={C} r={C - 2.5} fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" />
              <circle cx={C} cy={C} r={R + 3} fill="#1b3459" />

              {/* gajos que giran */}
              <g
                style={{
                  transformOrigin: "50% 50%",
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.62, 0.1, 1)` : "none",
                }}
              >
                {PRIZES.map((p, i) => (
                  <path key={p.id} d={segmentPath(i)} fill={p.color} stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" />
                ))}
                {PRIZES.map((p, i) => (
                  <SegmentLabel key={`l-${p.id}`} prize={p} index={i} />
                ))}
              </g>

              {/* sombreado y brillo sobre los gajos (fijos, dan volumen) */}
              <circle cx={C} cy={C} r={R} fill="url(#faceShade)" pointerEvents="none" />
              <path
                d={`M ${polar(-62, R - 6).join(" ")} A ${R - 6} ${R - 6} 0 0 1 ${polar(38, R - 6).join(" ")} Q ${C + 10} ${C - 70} ${polar(-62, R - 6).join(" ")} Z`}
                fill="url(#gloss)"
                opacity="0.55"
                pointerEvents="none"
              />

              {/* lamparitas del aro */}
              {Array.from({ length: BULBS }).map((_, i) => {
                const [x, y] = polar((360 / BULBS) * i, R + 9.5);
                return (
                  <g key={i} className={i % 2 ? "animate-blink" : ""} style={{ animationDelay: i % 2 ? "0.6s" : "0s" }}>
                    <circle cx={x} cy={y} r="6" fill="#ffe48a" opacity="0.35" />
                    <circle cx={x} cy={y} r="3.8" fill="url(#bulb)" stroke="#b07a00" strokeWidth="0.6" />
                  </g>
                );
              })}
            </svg>

            {/* centro: logo de Blue */}
            <div
              className="absolute left-1/2 top-1/2 flex h-[21%] w-[21%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-100"
              style={{
                boxShadow:
                  "0 0 0 5px #234e92, 0 0 0 8px #bcd9fb, inset 0 -6px 10px rgba(35,78,146,0.18), 0 6px 14px rgba(27,52,89,0.45)",
              }}
            >
              <LogoMark width="90%" height="90%" round style={{ filter: "none" }} />
            </div>
          </div>

          {/* puntero 3D: parado sobre el borde, mirando al usuario */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 w-[15%]"
            style={{
              transformOrigin: "50% 100%",
              transform: `translate(-50%, -64%) translateZ(26px) rotateX(-${TILT}deg)`,
            }}
          >
              <div
                key={pointerTick}
                className={spinning ? "animate-pointerTap" : ""}
                style={{ transformOrigin: "50% 7%", animationDuration: `${pointerDuration}ms` }}
              >
                <svg viewBox="0 0 64 88" className="w-full overflow-visible" style={{ filter: "drop-shadow(0 8px 6px rgba(27,52,89,0.45))" }}>
              <defs>
                <linearGradient id="pinGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff3b8" />
                  <stop offset="45%" stopColor="#ffd34d" />
                  <stop offset="100%" stopColor="#d9941a" />
                </linearGradient>
                <radialGradient id="pinGem" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#dcecff" />
                  <stop offset="50%" stopColor="#3b7fd9" />
                  <stop offset="100%" stopColor="#1b3459" />
                </radialGradient>
              </defs>
              <path d="M32 84 L8 40 A27 27 0 1 1 56 40 Z" fill="url(#pinGold)" stroke="#8a5a00" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M32 74 L15 42 A20.5 20.5 0 1 1 49 42 Z" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.6" />
              <circle cx="32" cy="29" r="12" fill="url(#pinGem)" stroke="#8a5a00" strokeWidth="2" />
              <ellipse cx="28" cy="24" rx="4.5" ry="3" fill="#ffffff" opacity="0.8" />
                </svg>
              </div>
          </div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        className={`mt-10 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 px-12 py-4 text-2xl font-extrabold text-white shadow-lg shadow-blue-600/30 ring-2 ring-white/60 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-butter ${
          spinning || disabled
            ? "cursor-not-allowed opacity-60"
            : "animate-pulseRing hover:scale-105 active:scale-95"
        }`}
      >
        {spinning ? "Girando…" : "¡Girar la ruleta!"}
      </button>
    </div>
  );
}
