# Arequipa Accesible

Aplicación web para la gestión y el seguimiento de incidencias de accesibilidad urbana en Arequipa. La plataforma permite a la ciudadanía registrar barreras y consultar sus reportes, mientras que el personal municipal puede visualizar indicadores y administrar reportes y usuarios.

## Características

- Autenticación ciudadana con inicio de sesión, registro y recuperación de contraseña.
- Panel ciudadano para consultar reportes y registrar una nueva incidencia.
- Flujo de registro de reportes con detalle, evidencia, ubicación y descripción.
- Panel administrativo con indicadores de gestión y mapa de incidencias.
- Gestión y filtrado de reportes.
- Gestión y filtrado de usuarios.
- Carga diferida de módulos y componentes para las rutas principales.

La rama `feat/integracion-frontend`, basada en `dev`, conecta el MVP con el backend Java y Supabase Auth. Ver [INTEGRACION.md](INTEGRACION.md) para contratos, comandos ejecutados, pruebas y limitaciones verificadas. Los servicios de cuadrillas, IA y certificaciones oficiales no están habilitados.

## Tecnologías

- Angular 20
- TypeScript
- Tailwind CSS
- Angular Router
- Jasmine y Karma

## Requisitos

- Node.js compatible con Angular 20.
- npm.

## Instalación y ejecución

Instala las dependencias del proyecto:

```bash
npm ci
```

Inicia el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en **http://localhost:3000/**. El backend debe estar activo en http://localhost:8080. `npm start` usa `proxy.conf.json` para enviar `/api/**` al backend; configurar `CORS_ALLOWED_ORIGINS=http://localhost:3000` en este último.

Antes de arrancar, crear `public/config.json` a partir de `public/config.example.json` con la URL y la clave **publicable real** de Supabase. El archivo se ignora en Git. También se puede ejecutar `ops/configure-local.ps1 -SupabaseUrl <URL_REAL> -SupabasePublishableKey <CLAVE_PUBLICABLE_REAL>`, sustituyendo los marcadores. Nunca copiar contraseñas JDBC, claves secretas o claves de Storage al frontend.

Supabase debe autorizar el origen http://localhost:3000 como redirección local. Los correos de acceso, registro y recuperación vuelven al origen; PKCE y la sesión utilizan localStorage para funcionar entre pestañas del mismo navegador. Cerrar sesión desde la aplicación al terminar. Un límite temporal de correos se muestra como error; no hay reenvíos automáticos.

En producción, definir el origen definitivo en Supabase/CORS y servir frontend/API mediante HTTPS. Usar un reverse proxy para `/api` o configurar la URL HTTPS de la API en config.json. El proxy de Angular es solo para desarrollo; configurar el fallback de rutas a index.html en el servidor web.

## Comandos disponibles

| Comando         | Descripción                                       |
| --------------- | ------------------------------------------------- |
| `npm start`     | Inicia el servidor de desarrollo con Angular CLI. |
| `npm run build` | Genera la compilación de producción en `dist/`.   |
| `npm run watch` | Compila en modo desarrollo y observa cambios.     |
| `npm test`      | Ejecuta las pruebas unitarias con Karma.          |

Para ejecutar las pruebas una sola vez en un entorno sin interfaz gráfica:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

## Rutas principales

### Autenticación

| Ruta                                  | Descripción                 |
| ------------------------------------- | --------------------------- |
| `/inicio-sesion`                      | Inicio de sesión.           |
| `/inicio-sesion/registro`             | Registro de ciudadano.      |
| `/inicio-sesion/recuperar-contrasena` | Recuperación de contraseña. |

### Ciudadanía

| Ruta                                   | Descripción                            |
| -------------------------------------- | -------------------------------------- |
| `/ciudadano`                           | Panel principal ciudadano.             |
| `/ciudadano/nuevo-reporte`             | Inicio del registro de una incidencia. |
| `/ciudadano/nuevo-reporte/evidencia`   | Registro de evidencia y ubicación.     |
| `/ciudadano/nuevo-reporte/descripcion` | Descripción y resumen del reporte.     |
| `/ciudadano/reportes`                  | Consulta de reportes del ciudadano.    |

### Administración

| Ruta        | Descripción               |
| ----------- | ------------------------- |
| `/`         | Dashboard administrativo. |
| `/reportes` | Gestión de reportes.      |
| `/usuarios` | Gestión de usuarios.      |

## Estructura del proyecto

```text
src/app/
├── features/
│   ├── admin/       # Dashboard y gestión municipal
│   ├── auth/        # Inicio de sesión, registro y recuperación
│   └── citizen/     # Panel ciudadano y registro de reportes
├── app.routes.ts    # Rutas principales y carga diferida
└── app.config.ts    # Configuración global de Angular
```

Los recursos visuales se encuentran en `public/images/` y los estilos globales en `src/styles.css`.
