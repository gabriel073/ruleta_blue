# Blue · Ruleta de premios

Next.js (App Router) + React + Tailwind CSS.

    npm install
    npm run dev      # http://localhost:3000

- Premios y probabilidades: `lib/prizes.js`
- Logo: `components/Logo.js` (reemplazalo por el logo real)
- API interna de participantes: `app/api/participantes/route.js`

## Google Sheets

Los registros se envían desde el formulario al endpoint interno `POST /api/participantes`. El servidor Next.js reenvía esos datos a una implementación de Google Apps Script; el token de acceso queda en variables del servidor y no se expone al navegador. Cuando la ruleta determina un resultado, la aplicación envía `PATCH /api/participantes` para actualizar el premio de esa misma fila.

La hoja tendrá estas columnas: `Fecha y hora`, `ID`, `Nombre`, `WhatsApp`, `Premio`, `Actualizado` y `Autorización WhatsApp`. El WhatsApp debe tener exactamente 10 dígitos, sin prefijo. Las fechas usan el formato `dd-mm-aaaa hh:mm` en la zona horaria configurada en la planilla. Se crea automáticamente una pestaña `Participantes` si no existe.

Si ya desplegaste Apps Script, vuelve a **Implementar > Administrar implementaciones > Editar** y publica una nueva versión para aplicar el cambio de correo a WhatsApp y el formato de fecha.

### Configuración de Google

1. Crea una hoja de cálculo de Google y copia su ID desde la URL: `https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit`.
2. En esa hoja, abre **Extensiones > Apps Script** y pega el contenido de `google-apps-script/Code.gs`.
3. En Apps Script, abre **Configuración del proyecto > Propiedades de secuencia de comandos** y agrega `SPREADSHEET_ID` con el ID de la hoja, `API_TOKEN` con un token largo aleatorio y, opcionalmente, `SHEET_NAME` con `Participantes`.
4. Despliega el script con **Implementar > Nueva implementación > Aplicación web**. Selecciona **Ejecutar como: Yo** y acceso **Cualquier usuario**. La comprobación del token protege el endpoint.
5. Copia la URL de la aplicación web que termina en `/exec`.
6. Copia `.env.example` a `.env.local` y completa `GOOGLE_SHEETS_WEB_APP_URL` con esa URL y `GOOGLE_SHEETS_API_TOKEN` con el mismo token configurado en Apps Script.
7. Reinicia Next.js después de crear o cambiar `.env.local`.

En producción, configura esas dos variables en el proveedor donde esté desplegado Next.js. No pongas la URL/token en variables `NEXT_PUBLIC_*` ni en código del navegador.

## Aviso de premio por WhatsApp

La app envía una plantilla de WhatsApp cuando el resultado es un premio (`type: "win"`). El usuario debe aceptar el checkbox de autorización del formulario. El token de Meta se usa solo en el servidor, desde `app/api/whatsapp/ganador/route.js`.

### Requisitos de Meta

1. Usa **WhatsApp Business Platform / Cloud API**. Una cuenta personal común no se puede conectar a la API oficial para automatizar mensajes. El número emisor debe estar registrado en WhatsApp Business Platform; no es el número del ganador.
2. En Meta for Developers, crea una app de tipo Business y agrega el producto **WhatsApp**. Completa la configuración de WhatsApp Business Account y registra el número emisor.
3. En **WhatsApp > API Setup**, copia el **Phone number ID** (no el número visible del teléfono). Para pruebas, Meta ofrece un número de prueba y permite agregar destinatarios verificados.
4. Crea una plantilla y envíala a aprobación en WhatsApp Manager. Usa un nombre como `blue_aviso_ganador`, idioma `Spanish (Argentina)` (`es_AR`) y cuerpo como: `¡Hola {{1}}! ¡Felicitaciones! Ganaste {{2}} en Blue. Mostrá este mensaje en el local para reclamar tu premio.` La plantilla debe tener dos variables de texto en el cuerpo, en ese orden: nombre y premio.
5. Espera que Meta apruebe la plantilla. Como el participante no necesariamente escribió primero por WhatsApp, el mensaje usa plantilla aprobada y no un mensaje de texto libre. La autorización del checkbox debe describir claramente el aviso y guardarse junto al registro.
6. Genera un token de acceso apropiado para el entorno (para producción, usa un token duradero de un usuario del sistema con permisos de WhatsApp Business). No uses el token temporal de prueba al desplegar.
7. Completa las variables de `.env.local` desde `.env.example`. `META_WA_PHONE_PREFIX` es el prefijo internacional que se antepone a los 10 dígitos del formulario; por ejemplo, `549` si esos diez dígitos son el número nacional argentino en el formato esperado. `META_WA_API_VERSION` debe ser una versión vigente de Graph API indicada por Meta.
8. Reinicia `pnpm dev`. Al ganar, el modal informa si se aceptó el envío o muestra el error de Meta. En producción, agrega las mismas variables como secretos del servidor en el proveedor de hosting.

El receptor es `POST /api/whatsapp/ganador`. El endpoint valida datos y consentimiento, y manda el mensaje con una plantilla a `/{phone_number_id}/messages`. El código no puede activar la cuenta comercial, aprobar la plantilla ni crear credenciales de Meta en tu nombre; eso requiere acceso al Business Manager del titular.
