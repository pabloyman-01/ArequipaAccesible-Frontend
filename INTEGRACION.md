# Unión frontend/backend — 2026-10-24

Se clonó `dev` en la carpeta solicitada `D:\code\Arequipaaccesiblefront` y se creó `feat/integracion-frontend`. El backend usa `feat/integracion-backend`, basada también en dev. No se fusionaron automáticamente estas ramas en dev/main.

## Flujos conectados

- Supabase Auth: contraseña o enlace para cuentas existentes; registro, confirmación y recuperación. El usuario introduce su propia contraseña. Después de confirmar se completa el perfil mediante la API Java.
- GET/PUT/PATCH /api/usuarios/me: perfil real, documento enmascarado, estados internos y roles procedentes de PostgreSQL. No se guardan documentos en metadatos de Auth. Guardas por rol y perfil actualizado en cada navegación privada; el backend mantiene la autorización definitiva.
- Catálogos reales y registro en tres pasos con fotografía JPEG/PNG de hasta 5 MiB, ubicación elegida en mapa/GPS y descripción. El borrador vive en memoria, se pierde al recargar y se limpia al salir, cambiar de usuario o confirmar el envío. Coordenadas con hasta siete decimales; el área piloto se valida en el servidor.
- Listados propios/globales con filtros de código exacto, estado, severidad, tipo, distrito y fechas, y paginación por cursor. Se distingue cantidad de la página de un total global.
- Detalle, historial y fotos privadas autenticadas. Se utilizan Blob URLs temporales y se revocan al salir; el bucket continúa privado.
- Transiciones de estado válidas, estado esperado y motivo de rechazo. Los conflictos recargan sin reintentar el PATCH. Directorio administrativo con roles múltiples, documento enmascarado y activación/suspensión con motivo y confirmación en pantalla. La autosuspensión se deshabilita; no existe concesión de roles por HTTP.
- Dashboard con agregados reales, fechas y distrito. Se conservaron layouts, navegación, colores, tipografías, tarjetas KPI y mapa de selección de ubicación. Se adaptaron los paneles al contrato real y se retiraron los datasets ficticios de los cinco servicios.

Las rutas activas no presentan como reales cuadrillas, GPS de equipos, tiempos de llegada, certificados, RENIEC o IA. Algunos componentes/plantillas de maqueta quedan como código no enrutado para reutilizar su diseño.

## Configuración

Frontend: http://localhost:3000. Backend: http://localhost:8080. El proxy de Angular envía /api/** al backend. Se configuró localmente CORS para localhost:3000 y se añadió una prueba que rechaza otros orígenes. No hay migraciones ni cambios adicionales de esquema/permisos.

`public/config.json`, ignorado por Git, contiene únicamente apiBaseUrl, supabaseUrl y supabasePublishableKey. Se utilizaron la URL y la clave publicable existentes del proyecto, consultado mediante el conector Supabase. No se copiaron contraseñas JDBC, claves de Storage ni sesiones privadas del backend. Usar public/config.example.json u ops/configure-local.ps1 en otro equipo.

Los enlaces vuelven al origen de la aplicación, que debe estar autorizado en Supabase. Se usa PKCE y **localStorage**, compartido entre pestañas del mismo navegador. Al cerrar sesión se limpian el perfil, el borrador y el almacenamiento local de Auth, también si falla la red. Los JWT ya emitidos conservan su vigencia; el backend comprueba cuenta/rol por petición. El interceptor solo adjunta bearer al origen y prefijo exactos de la API; no a terceros.

No hay reintentos automáticos de escritura. Una respuesta perdida o 5xx del POST bloquea su reenvío e indica consultar Mis Reportes antes de intentar nuevamente. Los errores de red no se muestran como listas vacías exitosas.

## Comandos ejecutados

```powershell
git clone --branch dev --single-branch https://github.com/pabloyman-01/ArequipaAccesible-Frontend.git D:/code/Arequipaaccesiblefront
git switch -c feat/integracion-frontend
npm install --save-exact @supabase/supabase-js@2.118.0
npm install --save-dev --save-exact prettier@3.9.10
npm run build
$env:CHROME_BIN='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
npx ng test --watch=false --browsers=ChromeHeadless
npm audit --omit=dev --json
npm start
git diff --check
```

También se ejecutó Prettier sobre los archivos nuevos/modificados. En el backend: `ops/test-local-postgres.ps1 -Port 55440 -CheckBootstrap`, carga de `.env.local` con `ops/load-local-env.ps1` y `mvnw.cmd -B spring-boot:run`.

## Resultados

Compilación de producción correcta, SDK de Supabase con carga diferida y bundle inicial aproximado de 359 kB. Permanece el aviso de Leaflet CommonJS. Auditoría de producción: cero vulnerabilidades; la instalación informó tres avisos moderados en herramientas de desarrollo, sin actualizaciones forzadas.

Verificación final: **57 pruebas de frontend aprobadas** en Edge Chromium headless. Incluyen HTTP/bearer restringido, multipart, blobs privados, 409 sin reintento, permisos desde Java frente a metadatos, falta de perfil/suspensión, recuperación, logout/cambio de usuario, cursores y envío único/ambiguo. Las expectativas de los antiguos datos ficticios se sustituyeron por las del contrato real. Se corrigió la inclusión accidental de helpers Jasmine en el build de producción, excluyendo src/app/testing de tsconfig.app.

Backend: **141 pruebas aprobadas, cero fallos, errores y omitidas**, con PostgreSQL desechable, instalación limpia y baseline 3 + V4. No se ejecutaron fixtures en Supabase.

Un script Node con fetch y aserciones, enviado por stdin, comprobó el proxy contra los servicios reales: distritos 200 (un distrito), tipos de barrera 200 (seis categorías internas), reportes/dashboard sin sesión 401, preflight local 200 y origen ajeno 403. config.json solo tiene los tres campos públicos. Evidencia ignorada: `.local/proxy-real-proof.json`.

Se comprobó en navegador la redirección al acceso sin sesión y la pantalla sin errores de configuración. Durante la comprobación personal apareció un fallo de retorno PKCE porque el verificador estaba inicialmente en sessionStorage y el correo abría otra pestaña. Se corrigió usando localStorage compartido y comprobando explícitamente auth.initialize(); los fallos del intercambio se muestran y los códigos se retiran de la dirección.

El titular recibió después `email rate limit exceeded`. Se detuvieron las solicitudes y se añadió un mensaje claro. También confirmó que solicitaba el enlace en ChatGPT y lo abría en Opera: esos navegadores no comparten el verificador PKCE. Los enlaces deben solicitarse y abrirse en el mismo navegador. No se reutilizaron ni guardaron enlaces enviados por chat.

Posteriormente el titular autorizó definir una contraseña para su cuenta administradora existente mediante la API administrativa oficial de Supabase, sin enviar correos. La introdujo y guardó personalmente en un formulario temporal de loopback del backend. La operación definitiva quedó confirmada a las 22:54:03 UTC (17:54:03 de Perú); Supabase comprobó el acceso por contraseña y el titular confirmó que entró al panel administrativo del frontend. No se crearon cuentas ni perfiles ficticios. El procedimiento, controles y siete pruebas están en ops/PASSWORD_SETUP.md del backend.

Con la sesión renovada se verificaron respuestas 200 de perfil, reportes propios/globales, usuarios, dashboard, detalle e historial. Se conservaron CIUDADANO y ADMINISTRADOR y la cuenta ACTIVA. La foto privada del único reporte técnico se verificó con no-store y SHA-256 coincidente. La evidencia sin contraseña está en .local/password-login-real-proof.json del backend. El formulario temporal de 3002 quedó cerrado; frontend 3000 y backend 8080 continúan activos.

## Archivos y siguientes pasos

core/: DTOs, API, runtime config, Auth/interceptor/guardas y borrador. shared/: listas, detalle/historial/evidencia y perfil. features/auth, citizen y admin: pantallas/servicios/rutas conectados y cierre de sesión. Pruebas de sesión, HTTP y registro, proveedores exclusivos de tests y pruebas existentes adaptadas. Configuración: package.json/lockfile, proxy.conf.json, tsconfig.app.json, .gitignore, workflow frontend, config.example.json y ops/configure-local.ps1. Presentación: styles.css y templates. Documentación: README.md y este registro.

El bloqueo del acceso administrativo quedó resuelto. Queda completar las acciones que todavía no se han ejercitado personalmente desde el navegador, como crear otro reporte con foto: si se vuelve a probar una escritura real, identificarla expresamente como prueba técnica. El POST real anterior de HU-01 y los contratos multipart automatizados están verificados, pero no equivalen a una nueva creación completa desde esta interfaz.

Para desplegar: definir el origen definitivo en Supabase/CORS, HTTPS de ambos servicios, config.json público real y fallback de rutas Angular a index.html. El proxy de npm start es solo de desarrollo. Los módulos opcionales siguen pendientes.

Referencias: [Angular HTTP](https://angular.dev/guide/http/interceptors), [Supabase acceso](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [registro](https://supabase.com/docs/reference/javascript/auth-signup), [recuperación](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail).

Revisión adicional: se cubrió una cuenta a la que se retiraron todos los roles, mostrando acceso denegado sin un bucle de redirecciones.
