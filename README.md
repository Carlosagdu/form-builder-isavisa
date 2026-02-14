# Form Builder Isavisa

Aplicación web para diseñar, publicar y analizar formularios dinámicos.

## Resumen Ejecutivo

Form Builder Isavisa es una plataforma que permite a usuarios autenticados construir formularios personalizados, publicarlos y consultar respuestas recibidas. El proyecto incluye un constructor visual, vista previa, formulario público con envío de respuestas y panel de análisis básico.

## Funcionalidades Principales

- Builder visual de formularios con campos dinámicos.
- Persistencia de borradores y publicación de formularios.
- Vista previa de formulario antes de publicar.
- Formulario público para captura de respuestas.
- Panel de respuestas por formulario.
- Actualización de contador de respuestas en dashboard con Supabase Realtime (Broadcast + refresh de ruta).
- Selección de tema visual para el formulario público (temas predefinidos).

## Stack Tecnológico

- Frontend/Fullstack: Next.js (App Router)
- Lenguaje: TypeScript
- Estilos: Tailwind CSS
- Backend gestionado: Supabase (Postgres, Auth, Realtime)
- Validación: Zod
- UI/Íconos: componentes internos + lucide-react

## Arquitectura (alto nivel)

- `app/`: rutas, layouts y páginas (dashboard, auth, builder, preview, respuestas).
- `actions/`: server actions que coordinan casos de uso.
- `components/`: UI modular por dominios (`auth`, `home`, `form`).
- `lib/forms/`: repositorios, tipos y lógica de dominio.
- `lib/supabase/`: clientes (server/client) y middleware de sesión.
- `migrations/`: esquema SQL, RLS y realtime.

## Requisitos Previos

- Node.js 20 o superior
- npm 10 o superior
- Proyecto de Supabase creado y accesible

## Configuración Local

### 1) Instalar dependencias

```bash
npm install
```

### 2) Configurar variables de entorno

Crear `.env` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<tu-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
```

Notas importantes:

- Las tres variables deben pertenecer al mismo proyecto de Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` es sensible y solo debe usarse en backend.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente.

### 3) Aplicar migraciones en Supabase

Ejecutar en SQL Editor, en este orden:

1. `migrations/20260213_first_migration.sql`
2. `migrations/20260213_second_migration.sql`
3. `migrations/20260214_realtime_broadcast_form_responses.sql`

Qué configuran:

- Tabla `forms` con políticas RLS por owner.
- Tabla `form_responses` con inserción controlada para formularios publicados.
- Trigger y política de Realtime Broadcast para notificar nuevas respuestas.

### 4) Levantar entorno local

```bash
npm run dev
```

Acceso local:

- `http://localhost:3000`

## Flujo Funcional de Verificación

1. Registrar usuario en `/auth/register`.
2. Iniciar sesión y crear formulario en `/form/new`.
3. Agregar campos y seleccionar tema visual.
4. Publicar formulario.
5. Abrir `/form/{id}` y enviar respuestas.
6. Verificar en dashboard:
- aumento del contador de respuestas
- acceso a detalle en `/form/{id}/responses`

## Seguridad y Control de Acceso

- Middleware protege rutas internas (dashboard, builder, preview de edición y respuestas).
- Supabase Auth administra sesión.
- RLS habilitado para restringir lectura/escritura por contexto de usuario.
- Acceso público limitado al envío de respuestas en formularios publicados.

## Realtime

La actualización de respuestas en dashboard se soporta por Broadcast de Supabase:

- Un trigger en `form_responses` emite eventos al canal privado del owner.
- Un listener cliente recibe eventos `INSERT`.
- La UI ejecuta refresh de ruta para reflejar contador actualizado.

## Scripts Disponibles

- `npm run dev`: iniciar entorno de desarrollo.
- `npm run lint`: ejecutar ESLint.
- `npm run build`: generar build de producción.
- `npm run start`: ejecutar build generado.

## Troubleshooting

### Error: variables de entorno faltantes

Revisar `.env` y confirmar que estén presentes:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Error de sesión o redirecciones inesperadas

Validar reglas de `lib/supabase/middleware.ts`, especialmente rutas protegidas y flujo de logout.

### Realtime no conecta

- Confirmar migración `20260214_realtime_broadcast_form_responses.sql` aplicada.
- Confirmar sesión activa en dashboard.
- Confirmar keys del mismo proyecto.
- Si usas Firefox, revisar bloqueo de WebSocket por protección de tracking.

## Checklist de Pre-Deploy

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Configurar variables de entorno en el proveedor de hosting.
4. Aplicar migraciones en el ambiente objetivo.
5. Probar flujo completo: auth, builder, publicación, respuestas y dashboard.

## Estado del Proyecto

MVP funcional con base sólida para iteraciones de producto (temas adicionales, analítica extendida, optimizaciones de realtime y UX).
