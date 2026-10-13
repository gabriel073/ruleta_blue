"use client";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function RegisterForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    const next = {};
    if (name.trim().length < 2) next.name = "Escribí tu nombre.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Revisá el mail, parece incompleto.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      try {
        await onSubmit({ name: name.trim(), email: email.trim() });
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
          <span className="mb-1 block font-bold">Mail</span>
          <input
            type="email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tumail@ejemplo.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="mt-1 block text-sm font-bold text-rose-600">{errors.email}</span>}
        </label>

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
