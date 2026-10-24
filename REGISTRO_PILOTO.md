# Registro del piloto sin confirmación de correo

Solicitud del propietario: permitir temporalmente el registro con correo/contraseña sin esperar el correo de confirmación de Supabase. La guía del MVP exige Supabase Auth, JWT y roles, pero no establece expresamente la confirmación de correo como requisito.

## Configuración remota

En el proyecto de Supabase, Authentication → Sign In / Providers → Confirm email se desactiva y se guarda. El equivalente en la Management API es mailer_autoconfirm=true. Esta opción afecta al proyecto completo: no comprueba que quien registra una dirección sea su propietario. Es una excepción del piloto que debe revisarse antes de un despliegue público.

El conector disponible no expone la modificación de Auth config y no hay un token de Management API configurado en este equipo. Por ello, se preparó el código y se pidió al propietario hacer ese cambio final en el panel. No se intenta sustituir ese permiso con SQL ni con la secret key del proyecto.

El estado se comprueba por el endpoint público `/auth/v1/settings`, usando únicamente la clave publicable. mailer_autoconfirm=false significa que todavía exige confirmación; true significa alta automática. Este archivo no cambia por sí mismo la opción de Supabase.

## Comportamiento del frontend

- Antes de registrar consulta el modo real del servidor, sin caché. Si falta o falla esa consulta, informa el error y no intenta crear una cuenta suponiendo otro modo.
- Con confirmación activa conserva el cliente PKCE existente y muestra la indicación de revisar el correo si no recibe sesión.
- Con confirmación desactivada registra correo/contraseña con un cliente SDK transitorio sin persistencia ni detección de enlaces. Usa el modo sin PKCE para esta operación, según el contrato de Supabase de registro automático. La sesión auténtica devuelta por Supabase se adopta en el cliente principal y se abre el perfil inmediatamente.
- Los accesos por enlace y la recuperación conservan PKCE. No se envían tokens en una URL en el registro automático ni se agregan claves de servidor al navegador.
- El perfil se crea mediante PUT /api/usuarios/me y recibe CIUDADANO. La desactivación del correo no concede ADMINISTRADOR ni verifica documentos de identidad. El backend mantiene JWT, autorización, estado de cuenta y validación de datos.
- La recuperación de contraseña y el acceso por enlace siguen enviando correos; este cambio solo evita la confirmación para las altas nuevas. El inicio con contraseña no necesita correo por cada acceso.

El texto del registro es neutral respecto a la configuración. Solo anuncia revisar el correo cuando la respuesta realmente requiere ese paso. Si la cuenta se creó pero falla adoptar su sesión, indica iniciar sesión con las credenciales ya elegidas, sin reintentos automáticos del alta.

## Verificación

Se ejecutaron `npm run build` y `npx ng test --watch=false --browsers=ChromeHeadless`, con Edge Chromium local: compilación correcta y **64 pruebas aprobadas**. Las siete nuevas verificaciones cubren la configuración pública y sus errores, la sesión inmediata, fallo de adopción sin duplicar el alta, y los dos recorridos de la pantalla de registro.

Después de que el propietario guardó el ajuste, se verificó el endpoint real el 2026-10-24 a las 23:14:42 UTC (18:14:42 en Perú): mailer_autoconfirm=true, proveedor de correo habilitado y registros habilitados. La evidencia sin claves se conserva en .local/registration-settings-proof.json del backend, ignorada por Git. La compilación y las 64 pruebas también pasaron en CI (ejecución 40141684932). Las pruebas automatizadas no crean usuarios ni envían correos reales; queda pendiente probar un alta nueva desde el navegador con datos del titular.

Comandos realmente ejecutados: Prettier sobre los archivos modificados, `npm run build`, `npx ng test --watch=false --browsers=ChromeHeadless`, GET público de settings desde Node y `git diff --check`. Archivos: core/runtime-config.service.ts, core/auth.service.ts, sus pruebas y confirmation-settings.spec.ts; pantalla register.ts/html/spec; este registro y README.md.

Para volver a exigir confirmación se activa Confirm email. El cliente consulta el ajuste en cada alta y vuelve al flujo PKCE sin cambiar claves ni roles.

Referencias: [configuración de Auth](https://supabase.com/docs/guides/auth/general-configuration), [registro y restricción PKCE/autoconfirm](https://supabase.com/docs/reference/javascript/auth-signup), [Management API](https://supabase.com/docs/reference/api/v1-update-auth-service-config).
