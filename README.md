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

> Actualmente, las acciones de autenticación y los datos de reportes y usuarios se manejan de forma local, sin conexión a un servicio backend.

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
npm install
```

Inicia el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible normalmente en `http://localhost:4200/`.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo con Angular CLI. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run watch` | Compila en modo desarrollo y observa cambios. |
| `npm test` | Ejecuta las pruebas unitarias con Karma. |

Para ejecutar las pruebas una sola vez en un entorno sin interfaz gráfica:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

## Rutas principales

### Autenticación

| Ruta | Descripción |
| --- | --- |
| `/inicio-sesion` | Inicio de sesión. |
| `/inicio-sesion/registro` | Registro de ciudadano. |
| `/inicio-sesion/recuperar-contrasena` | Recuperación de contraseña. |

### Ciudadanía

| Ruta | Descripción |
| --- | --- |
| `/ciudadano` | Panel principal ciudadano. |
| `/ciudadano/nuevo-reporte` | Inicio del registro de una incidencia. |
| `/ciudadano/nuevo-reporte/evidencia` | Registro de evidencia y ubicación. |
| `/ciudadano/nuevo-reporte/descripcion` | Descripción y resumen del reporte. |
| `/ciudadano/reportes` | Consulta de reportes del ciudadano. |

### Administración

| Ruta | Descripción |
| --- | --- |
| `/` | Dashboard administrativo. |
| `/reportes` | Gestión de reportes. |
| `/usuarios` | Gestión de usuarios. |

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
