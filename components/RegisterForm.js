"use client";
import { useState } from "react";

const WHATSAPP_RE = /^\d{10}$/;

export default function RegisterForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    const next = {};
    if (name.trim().length < 2) next.name = "Escribí tu nombre.";
    if (!WHATSAPP_RE.test(whatsapp)) {
      next.whatsapp = "Ingresá exactamente 10 números, sin prefijo.";
    }
    if (!whatsappConsent) next.whatsappConsent = "Necesitamos tu autorización para enviarte el resultado por WhatsApp.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      try {
        await onSubmit({ name: name.trim(), whatsapp: whatsapp.trim(), whatsappConsent });
      } catch (error) {
        setErrors({ submit: error.message || "No se pudo guardar el registro. Probá de nuevo." });
      } finally {
        setSubmitting(false);
      }
    }
  }

  const field =
    "w-full rounded-2xl border-2 border-blue-200 bg-white px-5 py-4 text-lg font-semibold text-blue-900 placeholder:text-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200";

  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md animate-pop rounded-[2rem] bg-white/80 p-8 shadow-xl shadow-blue-900/10 backdrop-blur"
      >
        <h2 className="text-3xl font-black text-blue-800">¿Quién juega?</h2>
        <p className="mt-2 text-blue-700">
          Así armamos tu premio con tu nombre.
        </p>
        {errors.submit && <p role="alert" className="mt-4 font-bold text-rose-600">{errors.submit}</p>}

        <label className="mt-6 block">
          <span className="mb-1 block font-bold">Nombre</span>
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Sofía"
            autoComplete="given-name"
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="mt-1 block text-sm font-bold text-rose-600">{errors.name}</span>}
        </label>

        <label className="mt-4 block">
          <span className="mb-1 block font-bold">Número de WhatsApp</span>
          <input
            type="tel"
            className={field}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Ej: 1123456789"
            autoComplete="tel"
            inputMode="tel"
            maxLength={10}
            minLength={10}
            pattern="[0-9]{10}"
            aria-invalid={!!errors.whatsapp}
          />
          {errors.whatsapp && <span className="mt-1 block text-sm font-bold text-rose-600">{errors.whatsapp}</span>}
        </label>

        <label className="mt-5 flex items-start gap-3 text-sm font-semibold text-blue-800">
          <input
            type="checkbox"
            checked={whatsappConsent}
            onChange={(event) => setWhatsappConsent(event.target.checked)}
            className="mt-1 h-5 w-5 accent-blue-700"
            aria-invalid={!!errors.whatsappConsent}
          />
          <span>Acepto recibir por WhatsApp un mensaje con el resultado si gano.</span>
        </label>
        {errors.whatsappConsent && <span className="mt-1 block text-sm font-bold text-rose-600">{errors.whatsappConsent}</span>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-full bg-blue-600 py-4 text-xl font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-butter active:scale-95 disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? "Guardando…" : "Ir a la ruleta"}
        </button>
      </form>
    </section>
  );
}
