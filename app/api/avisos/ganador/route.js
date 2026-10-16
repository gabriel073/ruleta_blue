import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Aviso gratuito al dueño por Telegram (Bot API oficial). Te llega al celular al instante
// con el nombre, el premio y un link wa.me para escribirle a la ganadora por WhatsApp.
const TELEGRAM_URL = process.env.TELEGRAM_API_URL || "https://api.telegram.org";

// Mensaje que se le va a enviar a la ganadora por WhatsApp. Editalo a gusto:
// se abre ya escrito al tocar el botón del aviso; solo hay que apretar "enviar".
const winnerMessage = (name, prize) =>
  `¡Hola ${name}! 🎉 ¡Felicitaciones! Ganaste ${prize} en Blue Corrientes. \n\n` +
  `Mostrá este mensaje en el local para reclamar tu premio. 🎁\n` +
   `✨\n✨\n✨\n✨\n` +
  `Seguinos en nuestras redes para no perderte las novedades, premios y ofertas:\n` +
  `📸 Instagram: @bluebabykids\n` +
  `🎵 TikTok: @bluebaby_h`;

// Límite simple por IP para que nadie use el endpoint para spamear tus avisos.
// (En hosting serverless es un freno "mejor esfuerzo", suficiente para este caso.)
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 20;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

// Saca saltos de línea y caracteres raros para que un nombre no pueda "falsificar" el aviso
const clean = (value, max) =>
  String(value ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);

export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json(
      { ok: false, error: "Falta configurar Telegram en el servidor." },
      { status: 503 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Demasiados avisos." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Datos ilegibles." }, { status: 400 });
  }

  const name = clean(body?.name, 80);
  const prize = clean(body?.prize, 80);
  const whatsapp = String(body?.whatsapp ?? "");
  if (name.length < 2 || !prize || !/^\d{10}$/.test(whatsapp)) {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  // Prefijo internacional de Argentina para celulares (+54 9). Cambialo solo si tus clientes son de otro país.
  const prefix = process.env.WHATSAPP_PHONE_PREFIX || "549";
  const waUrl = new URL(`https://wa.me/${prefix}${whatsapp}`);
  waUrl.searchParams.set("text", winnerMessage(name, prize));
  const waLink = waUrl.toString();
  const text =
    `🎉 Ganó en la ruleta Blue\n` +
    `${name} → ${prize}\n` +
    `Tocá el botón para enviarle su mensaje por WhatsApp.`;

  try {
    const response = await fetch(`${TELEGRAM_URL}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        link_preview_options: { is_disabled: true },
        reply_markup: {
          inline_keyboard: [[{ text: `📲 Enviarle WhatsApp a ${name}`, url: waLink }]],
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      // No logueamos la URL (lleva el token). Solo el motivo que informa Telegram.
      console.error("[Telegram] rechazó el aviso:", result?.description || response.status);
      return NextResponse.json({ ok: false, error: "Telegram no aceptó el aviso." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Telegram] error de conexión:", error?.name || "desconocido");
    return NextResponse.json({ ok: false, error: "No se pudo enviar el aviso." }, { status: 502 });
  }
}
