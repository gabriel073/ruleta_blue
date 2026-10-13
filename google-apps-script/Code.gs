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
      if (!data.id || !data.name || !data.email) {
        return jsonResponse({ ok: false, error: "Faltan datos del participante." });
      }

      const lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        sheet.appendRow([data.createdAt || new Date().toISOString(), data.id, data.name, data.email, "", ""]);
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

      sheet.getRange(match.getRow(), 5, 1, 2).setValues([[data.prize, new Date().toISOString()]]);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Acción no válida." });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || "Error al guardar en la hoja." });
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Fecha", "ID", "Nombre", "Correo", "Premio", "Actualizado"]);
  }
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}