import { NextResponse } from "next/server";

async function sendToSheets(payload) {
  const url = process.env.GOOGLE_SHEETS_WEB_APP_URL;
  const token = process.env.GOOGLE_SHEETS_API_TOKEN;

  if (!url || !token) {
    return NextResponse.json(
      { ok: false, error: "Falta configurar la conexión con Google Sheets." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, token }),
      cache: "no-store",
    });
    const responseBody = await response.text();
    let result;
    try {
      result = JSON.parse(responseBody);
    } catch {
      result = null;
    }

    if (response.status === 404) {
      return NextResponse.json(
        { ok: false, error: "Google Apps Script respondió 404. Revisá que uses la URL de la aplicación web desplegada, terminada en /exec." },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Google Apps Script respondió HTTP ${response.status}. Revisá el despliegue y los permisos.` },
        { status: 502 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { ok: false, error: "Google Apps Script no devolvió JSON. Verificá la URL de aplicación web y el acceso del despliegue." },
        { status: 502 }
      );
    }

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Google Sheets no pudo guardar los datos." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo conectar con Google Sheets." },
      { status: 502 }
    );
  }
}

export async function POST(request) {
  try {
    const { id, name, email } = await request.json();
    if (!id || typeof name !== "string" || name.trim().length < 2 || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Los datos del participante no son válidos." }, { status: 400 });
    }

    return sendToSheets({
      action: "register",
      id,
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudieron leer los datos enviados." }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const { id, prize } = await request.json();
    if (typeof id !== "string" || !id || typeof prize !== "string" || !prize.trim()) {
      return NextResponse.json({ ok: false, error: "Falta el participante o el premio." }, { status: 400 });
    }

    return sendToSheets({ action: "updatePrize", id, prize: prize.trim() });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudieron leer los datos enviados." }, { status: 400 });
  }
}
