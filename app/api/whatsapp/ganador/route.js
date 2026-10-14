import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, whatsapp, prize, whatsappConsent } = await request.json();
    const accessToken = process.env.META_WA_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;
    const templateName = process.env.META_WA_TEMPLATE_NAME;
    const languageCode = process.env.META_WA_LANGUAGE_CODE || "es_AR";
    const phonePrefix = process.env.META_WA_PHONE_PREFIX;
    const apiVersion = process.env.META_WA_API_VERSION;

    if (!accessToken || !phoneNumberId || !templateName || !phonePrefix || !apiVersion) {
      return NextResponse.json(
        { ok: false, error: "Falta configurar WhatsApp Cloud API en el servidor." },
        { status: 503 }
      );
    }

    if (
      typeof name !== "string" || !name.trim() ||
      typeof whatsapp !== "string" || !/^\d{10}$/.test(whatsapp) ||
      typeof prize !== "string" || !prize.trim() ||
      whatsappConsent !== true
    ) {
      return NextResponse.json(
        { ok: false, error: "Los datos del ganador o su autorización no son válidos." },
        { status: 400 }
      );
    }

    if (!/^\d{1,4}$/.test(phonePrefix) || !/^v\d+\.\d+$/.test(apiVersion)) {
      return NextResponse.json(
        { ok: false, error: "El prefijo internacional o la versión de Meta API no son válidos." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: `${phonePrefix}${whatsapp}`,
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: name.trim() },
                  { type: "text", text: prize.trim() },
                ],
              },
            ],
          },
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: result.error?.message || "Meta rechazó el envío del mensaje." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, messageId: result.messages?.[0]?.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo conectar con WhatsApp Cloud API." },
      { status: 502 }
    );
  }
}
