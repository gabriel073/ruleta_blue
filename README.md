# Blue · Ruleta de premios

Next.js (App Router) + React + Tailwind CSS.

    npm install
    npm run dev      # http://localhost:3000

- Premios y probabilidades: `lib/prizes.js`
- Logo: `components/Logo.js` (reemplazalo por el logo real)
- API interna de participantes: `app/api/participantes/route.js`

## Google Sheets

Los registros se envían desde el formulario al endpoint interno `POST /api/participantes`. El servidor Next.js reenvía esos datos a una implementación de Google Apps Script; el token de acceso queda en variables del servidor y no se expone al navegador. Cuando la ruleta determina un resultado, la aplicación envía `PATCH /api/participantes` para actualizar el premio de esa misma fila.

La hoja tendrá estas columnas: `Fecha`, `ID`, `Nombre`, `Correo`, `Premio` y `Actualizado`. Se crea automáticamente una pestaña `Participantes` si no existe.

### Configuración de Google

1. Crea una hoja de cálculo de Google y copia su ID desde la URL: `https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit`.
2. En esa hoja, abre **Extensiones > Apps Script** y pega el contenido de `google-apps-script/Code.gs`.
3. En Apps Script, abre **Configuración del proyecto > Propiedades de secuencia de comandos** y agrega `SPREADSHEET_ID` con el ID de la hoja, `API_TOKEN` con un token largo aleatorio y, opcionalmente, `SHEET_NAME` con `Participantes`.
4. Despliega el script con **Implementar > Nueva implementación > Aplicación web**. Selecciona **Ejecutar como: Yo** y acceso **Cualquier usuario**. La comprobación del token protege el endpoint.
5. Copia la URL de la aplicación web que termina en `/exec`.
6. Copia `.env.example` a `.env.local` y completa `GOOGLE_SHEETS_WEB_APP_URL` con esa URL y `GOOGLE_SHEETS_API_TOKEN` con el mismo token configurado en Apps Script.
7. Reinicia Next.js después de crear o cambiar `.env.local`.

En producción, configura esas dos variables en el proveedor donde esté desplegado Next.js. No pongas la URL/token en variables `NEXT_PUBLIC_*` ni en código del navegador.
