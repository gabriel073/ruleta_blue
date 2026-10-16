"use client";
import { useState } from "react";
import Splash from "@/components/Splash";
import RegisterForm from "@/components/RegisterForm";
import Wheel from "@/components/Wheel";
import PrizeModal from "@/components/PrizeModal";
import LogoMark from "@/components/LogoMark";

// crypto.randomUUID solo existe en HTTPS/localhost; este reemplazo evita que falle al probar desde el celular por IP local
function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function Home() {
  const [step, setStep] = useState("splash"); // splash | form | wheel
  const [user, setUser] = useState(null);
  const [prize, setPrize] = useState(null);
  const [sheetsError, setSheetsError] = useState("");

  async function handleRegister(data) {
    const participant = { ...data, id: newId() };
    const response = await fetch("/api/participantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participant),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "No se pudo guardar el registro.");
    }

    setUser(participant);
    setStep("wheel");
  }

  function handleResult(p) {
    setPrize(p);
    setSheetsError("");
    fetch("/api/participantes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, prize: p.title }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || "No se pudo actualizar el premio.");
      })
      .catch((error) => setSheetsError(error.message));

    if (p.type === "win") {
      // Aviso gratuito al dueño por Telegram. Es silencioso: si no está configurado o falla, la ganadora no se entera.
      fetch("/api/avisos/ganador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, whatsapp: user.whatsapp, prize: p.title }),
      }).catch(() => {});
    }
  }

  function reset() {
    setPrize(null);
    setUser(null);
    setStep("splash");
  }

  return (
    <main>
      {step === "splash" && <Splash onStart={() => setStep("form")} />}
      {step === "form" && <RegisterForm onSubmit={handleRegister} />}
      {step === "wheel" && (
        <section className="flex min-h-screen flex-col items-center justify-center bg-[#e8d3ac] px-5 py-10">
          <div className="animate-idle">
            <LogoMark width="min(460px, 90vw)" height="min(192px, 38vw)" />
          </div>
          <p className="mb-2 mt-2 text-center text-xl font-bold text-blue-800">
            ¡Mucha suerte, {user.name}!
          </p>
          {sheetsError && <p role="alert" className="mb-3 text-center font-semibold text-rose-700">{sheetsError}</p>}
          <Wheel onResult={handleResult} disabled={!!prize} />
          {prize && (
            <PrizeModal
              user={user}
              prize={prize}
              onRetry={() => setPrize(null)}
              onFinish={reset}
            />
          )}
        </section>
      )}
    </main>
  );
}
