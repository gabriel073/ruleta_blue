function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const expectedToken = properties.getProperty("API_TOKEN");

    if (!expectedToken || data.token !== expectedToken) {
      return jsonResponse({ ok: false, error: "No autorizado." });
    }

    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    if (!spreadsheetId) {
      return jsonResponse({ ok: false, error: "Falta configurar SPREADSHEET_ID." });
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheetName = properties.getProperty("SHEET_NAME") || "Participantes";
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
    ensureHeaders(sheet);

    if (data.action === "register") {
      const missing = [];
      if (!data.id) missing.push("ID");
      if (typeof data.name !== "string" || !data.name.trim()) missing.push("nombre");
      if (typeof data.whatsapp !== "string" || !/^\d{10}$/.test(data.whatsapp)) {
        missing.push("WhatsApp de 10 números, sin prefijo");
      }
        if (data.whatsappConsent !== true) missing.push("autorización de WhatsApp");
      if (missing.length) {
        return jsonResponse({ ok: false, error: `Faltan datos válidos: ${missing.join(", ")}.` });
      }

      const lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        const row = sheet.getLastRow() + 1;
          sheet.getRange(row, 1, 1, 7).setValues([[createdAt, data.id, data.name, data.whatsapp, "", "", "Sí"]]);
        sheet.getRange(row, 1).setNumberFormat("dd-MM-yyyy HH:mm");
      } finally {
        lock.releaseLock();
      }
      return jsonResponse({ ok: true });
    }

    if (data.action === "updatePrize") {
      if (!data.id || !data.prize) {
        return jsonResponse({ ok: false, error: "Falta el participante o el premio." });
      }

      const lastRow = sheet.getLastRow();
      if (lastRow < 2) return jsonResponse({ ok: false, error: "No se encontró el participante." });

      const match = sheet.getRange(2, 2, lastRow - 1, 1)
        .createTextFinder(data.id)
        .matchEntireCell(true)
        .findNext();
      if (!match) return jsonResponse({ ok: false, error: "No se encontró el participante." });

      const row = match.getRow();
      sheet.getRange(row, 5, 1, 2).setValues([[data.prize, new Date()]]);
      sheet.getRange(row, 6).setNumberFormat("dd-MM-yyyy HH:mm");
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Acción no válida." });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || "Error al guardar en la hoja." });
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Fecha y hora", "ID", "Nombre", "WhatsApp", "Premio", "Actualizado", "Autorización WhatsApp"]);
  } else {
    const headers = sheet.getRange(1, 1, 1, 7).getValues()[0];
      if (!headers[6]) sheet.getRange(1, 7).setValue("Autorización WhatsApp");
    if (headers[0] === "Fecha") sheet.getRange(1, 1).setValue("Fecha y hora");
    if (headers[3] === "Correo") sheet.getRange(1, 4).setValue("WhatsApp");
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  [1, 6].forEach((column) => {
    const range = sheet.getRange(2, column, lastRow - 1, 1);
    const values = range.getValues().map(([value]) => {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return [value];
      const parsed = new Date(value);
      return [Number.isNaN(parsed.getTime()) ? value : parsed];
    });
    range.setValues(values);
    range.setNumberFormat("dd-MM-yyyy HH:mm");
  });
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}