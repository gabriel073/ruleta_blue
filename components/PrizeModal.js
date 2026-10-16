"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#3b7fd9", "#8fbdf5", "#ffe48a", "#ffc9d6", "#ffffff"];

function celebrate(big) {
  const end = Date.now() + (big ? 3200 : 1800);
  (function frame() {
    confetti({ particleCount: big ? 6 : 4, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, colors: COLORS });
    confetti({ particleCount: big ? 6 : 4, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: big ? 220 : 120, spread: 100, startVelocity: 45, origin: { y: 0.6 }, colors: COLORS });
}

export default function PrizeModal({ user, prize, onRetry, onFinish }) {
  const isWin = prize.type === "win";
  const isVoucher = prize.id === "voucher";

  useEffect(() => {
    if (isWin) celebrate(isVoucher);
  }, [isWin, isVoucher]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prize-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#e8d3ac]/75 px-5 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-md animate-pop rounded-[2rem] bg-white p-8 text-center shadow-2xl">
        {isWin ? (
          <>
            <p className="animate-wiggle text-5xl" aria-hidden>🎉</p>
            <h2 id="prize-title" className="mt-3 text-3xl font-black text-blue-800">
              ¡Felicitaciones, {user.name}!
            </h2>
            <p className="mt-2 text-lg font-semibold text-blue-700">Ganaste</p>
            <div
              className="mt-3 rounded-2xl px-4 py-5"
              style={{ background: prize.color, color: prize.ink }}
            >
              <p className="text-3xl font-black leading-tight">{prize.title}</p>
              <p className="mt-1 font-bold">{prize.detail}</p>
            </div>
            <p className="mt-4 text-sm font-semibold text-blue-700">
              Registramos tu premio con {user.whatsapp}. Mostrá esta pantalla en el local.
            </p>
            <button
              onClick={onFinish}
              className="mt-6 w-full rounded-full bg-[#879b82] py-4 text-xl font-extrabold text-white transition hover:bg-[#71856d] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5b99f] active:scale-95"
            >
              Listo
            </button>
          </>
        ) : (
          <>
            <p className="animate-wiggle text-5xl" aria-hidden>🍼</p>
            <h2 id="prize-title" className="mt-3 text-3xl font-black text-blue-800">
              ¡Casi, {user.name}!
            </h2>
            <p className="mt-3 text-lg font-semibold text-blue-700">
              Salió “Seguí participando”. Tenés otra oportunidad.
            </p>
            <button
              onClick={onRetry}
              className="mt-6 w-full rounded-full bg-[#879b82] py-4 text-xl font-extrabold text-white transition hover:bg-[#71856d] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5b99f] active:scale-95"
            >
              Girar otra vez
            </button>
          </>
        )}
      </div>
    </div>
  );
}
