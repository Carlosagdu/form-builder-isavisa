# Decision Log (Resumen Ejecutivo)

## 1. Objetivo de diseño

Mi objetivo fue construir un MVP funcional de form builder con publicación, captura de respuestas y panel de seguimiento, priorizando velocidad de entrega, mantenibilidad y seguridad base.

## 2. Decisiones técnicas principales

- Elegí **Next.js (App Router) + TypeScript** como base del proyecto.
- Elegí **Supabase** (Postgres, Auth, Realtime) como backend gestionado.
- Definí una **arquitectura por capas**: `UI -> actions -> repository -> Supabase`.
- Usé **Zod** para validar entradas y payloads de forma consistente.

## 3. Por qué elegí estas librerías/stack

### Next.js + TypeScript
- Me permite usar SSR/Server Components y manejar rutas públicas/privadas de forma limpia.
- Mantengo frontend y lógica de servidor en un solo repositorio.
- TypeScript me da mayor confiabilidad al evolucionar el dominio.

### Supabase
- Me aceleró el desarrollo al integrar base de datos, autenticación y realtime sin backend dedicado al inicio.
- Pude apoyarme en RLS para seguridad a nivel de datos.
- Me simplificó la operación para etapa MVP.

### Zod
- Me permitió definir contratos de datos explícitos.
- Evité persistir esquemas/respuestas mal formadas.
- Mantuve validaciones alineadas entre cliente y servidor.

## 4. Modelado de datos: `jsonb` vs normalizado

## Decisión que tomé

Elegí `jsonb` para:

- `forms.schema` (estructura dinámica del formulario).
- `form_responses.answers` (respuestas dinámicas).

## Por qué tomé esta decisión

- El builder maneja campos variables (tipo, orden, opciones, requeridos, tema visual).
- Quise evitar migraciones frecuentes por cambios de estructura.
- Priorizé iteración rápida de producto en fases tempranas.

## Trade-offs que consideré

### Opción elegida: `jsonb`
- **Ventajas**:
  - Flexibilidad alta de esquema.
  - Menor costo de cambio.
  - Entrega rápida del MVP.
- **Desventajas**:
  - Analítica SQL más compleja que en tablas normalizadas.
  - Mayor disciplina en validación de datos.

### Opción descartada: modelo completamente normalizado
- **Ventaja que reconocí**: consultas analíticas más directas por joins.
- **Motivo por el que la descarté**: sobrecosto inicial alto para un dominio aún cambiante.

## Mitigaciones que apliqué

- Creé índices por patrones de acceso frecuentes:
  - `form_responses(form_id)`
  - `form_responses(form_id, submitted_at desc)`
  - índice GIN sobre `form_responses.answers`
- Mantuve una capa de dominio para análisis agregados, evitando acoplar la UI a SQL complejo.

## 5. Realtime: decisión y alcance

Elegí **Supabase Realtime Broadcast** para detectar nuevas respuestas y refrescar dashboard.

- Configuré trigger en DB para emitir evento al canal privado del owner.
- Implementé listener cliente para eventos `INSERT`.
- Actualicé el contador con refresh de ruta.

Trade-off que asumí:
- Es una solución simple y estable para MVP.
- No es la opción más granular (incremento local sin refresh), pero reduce complejidad y riesgo.

## 6. Seguridad y acceso

- Habilité RLS en tablas de dominio.
- Restringí lectura de respuestas al owner del formulario.
- Permití inserción de respuestas solo para formularios publicados.
- Apliqué middleware para control de rutas protegidas en frontend.

## 7. Cómo utilicé la IA como herramienta de desarrollo

Usé la IA como **copiloto técnico** para:

- acelerar iteraciones de implementación,
- evaluar alternativas y trade-offs,
- redactar/ajustar partes repetitivas de código.

Criterio que mantuve:

- Validé manualmente las decisiones finales (arquitectura, seguridad, modelo de datos y flujos).
- Mantuve revisión humana del impacto funcional y técnico.
- Utilicé IA para aumentar productividad, no para delegar decisiones críticas sin validación.

## 8. Conclusión

La arquitectura que definí prioriza **time-to-market + flexibilidad + seguridad base**, con una base sólida para evolucionar hacia:

- analítica más profunda,
- actualizaciones realtime más granulares,
- posible normalización parcial futura cuando el dominio se estabilice.
