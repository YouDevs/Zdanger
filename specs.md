# Proyecto: AlertaZona

## Contexto
El proyecto usará como referencia visual los archivos HTML/Blade ubicados en `resources/views`, generados previamente con Stitch AI, y el archivo `DESIGN.md`.

IMPORTANTE:
Las vistas de Stitch son referencia visual, no especificación funcional exacta.
Codex debe reutilizar la intención visual, estructura general y estilo, pero debe corregir textos, nombres, datos falsos, idioma y lógica de producto.

Nota de implementación actual:
- La carpeta de referencia real en este repo es `resources/views/demo`.
- Ya existe una base pública en React/Inertia para:
  - landing `/`
  - mapa `/view_map`
  - formulario `/report_incident_form`
- El layout público ya está separado y reutilizable.
- El tema por defecto debe permanecer en `light`.

## Nombre del producto
Usar temporalmente: AlertaZona

## Idioma
Toda la interfaz debe estar en español.

## Stack
- Laravel 13
- Inertia
- React 19
- Tailwind CSS
- PostgreSQL preferido
- SQLite permitido para MVP local
- Storage nativo de Laravel para evidencias
- Mapa inicialmente puede ser placeholder
- Preparar arquitectura para Google Maps o Mapbox después

Estado actual del frontend:
- `welcome.tsx` implementa la landing pública.
- `view_map.tsx` implementa el mapa placeholder y panel de detalle.
- `report_incident_form.tsx` implementa el formulario público de reporte.
- `PublicHeader`, `PublicFooter` y `PublicLayout` ya existen y deben reutilizarse.
- Componentes públicos ya creados:
  - `StatusBadge`
  - `ConfidenceBadge`

## Diseño
Usar `DESIGN.md` como fuente principal de estilo:
- Inter
- fondo claro
- azul institucional
- tarjetas blancas
- bordes suaves
- sombras sutiles
- diseño sobrio
- estética civic tech
- evitar estética de nota roja, violencia o miedo

## Principio de producto
La app NO confirma delitos automáticamente.
La app muestra reportes ciudadanos con distintos niveles de validación.

Usar lenguaje como:
- Reporte ciudadano
- Pendiente de revisión
- No verificado
- Validado por comunidad
- Validado con evidencia
- Confirmado por fuente externa

Evitar lenguaje como:
- Asalto confirmado
- Zona peligrosa garantizada
- Criminal identificado
- Amenaza activa

## Pantallas a implementar

### 1. Landing pública
Basarse en la vista de Stitch de landing.

Debe incluir:
- Header con logo AlertaZona
- Nav: Mapa, Reportar, Admin
- CTA principal: Ver mapa
- CTA secundario: Reportar incidente
- Hero con texto:
  "Reportes ciudadanos de seguridad en tu zona"
- Subtexto:
  "Consulta y reporta incidentes de forma responsable, anónima y basada en evidencia."
- Disclaimer:
  "Los reportes son ciudadanos y pueden estar pendientes de validación."
- Cards:
  - Mapa de reportes
  - Evidencia y validación
  - Reportes anónimos
  - Alertas por zona
- Sección de estados:
  - Pendiente
  - No verificado
  - Validado por comunidad
  - Validado con evidencia
  - Confirmado

No implementar todavía:
- Activar alertas
- Civic Data API
- Analytics reales

Estado actual:
- Implementada en `/`.
- Debe conservar:
  - header translúcido
  - hero con imagen rotada y hover
  - callout translúcido de reporte reciente
  - brújula decorativa
  - sección de cards
  - sección de estados
- Navegación activa:
  - `Ver mapa` -> `/view_map`
  - `Explorar mapa completo` -> `/view_map`
  - `Reportar incidente` -> `/report_incident_form`

### 2. Mapa público
Basarse en la vista de Stitch del mapa.

Layout desktop:
- Filtros a la izquierda
- Mapa al centro
- Panel de detalle a la derecha

Filtros:
- Tipo de incidente
- Rango de fecha
- Colonia
- Nivel de validación/confianza

Detalle del reporte:
- Tipo
- Zona aproximada
- Fecha/hora aproximada
- Estado
- Score de confianza
- Descripción
- Botón: "Yo también lo vi"
- Botón: "Marcar como falso"
- Botón: "Ver detalles"

Reglas:
- No mostrar dirección exacta públicamente.
- Mostrar ubicación aproximada.
- El mapa puede ser placeholder visual al inicio.
- Preparar componente para futura integración con Google Maps o Mapbox.

Estado actual:
- Implementado en `/view_map`.
- Ya existe layout general con:
  - sidebar de filtros
  - canvas placeholder de mapa
  - markers visuales
  - panel derecho de detalle
- Aún es mayormente estático y visual.
- Próximo paso funcional esperado:
  - conectar datos reales vía props/controladores
  - transformar filtros en estado real
  - sustituir textos demo por data de incidentes

### 3. Formulario de reporte
Basarse en la vista de Stitch del formulario, pero simplificar.

Para MVP usar una sola pantalla con secciones, no un wizard funcional obligatorio.

Campos:
- Tipo de incidente
- Descripción
- Fecha del suceso
- Hora aproximada
- Dirección aproximada
- Latitud
- Longitud
- Colonia
- Ciudad
- Evidencia opcional
- Reportar de forma anónima

Reglas:
- Anónimo debe estar activado por defecto.
- Evidencia es opcional en MVP.
- Mostrar aviso:
  "No mostraremos tu ubicación exacta públicamente."
- Mostrar disclaimer antes de enviar:
  "Al enviar este reporte confirmas que la información proporcionada es de buena fe. Este reporte no sustituye una denuncia oficial."

Tipos iniciales:
- robo
- intento_robo
- robo_vehiculo
- cristalazo
- agresion
- acoso
- vandalismo
- zona_riesgo
- otro

Estado actual:
- Implementado en `/report_incident_form`.
- Ya existe como pantalla única con secciones.
- Aún no está conectado a persistencia real.
- Mantener esta dirección de implementación:
  - sin wizard funcional en esta etapa
  - UX sobria
  - ubicación por placeholder
  - evidencia opcional
  - anonimato activado por defecto

### 4. Admin / Moderación
Basarse en la vista de Stitch de admin.

Debe incluir:
- Tabla de reportes
- Filtros por estado, tipo, ciudad y fecha
- Panel de detalle
- Evidencias adjuntas
- Notas internas
- Acciones de moderación

Acciones:
- Hacer visible como no verificado
- Validar con evidencia
- Confirmar por fuente externa
- Rechazar
- Marcar como duplicado
- Ocultar

Ignorar:
- Usuario fake "Alex Rivera"
- imágenes violentas
- videos fake
- textos en inglés
- botones genéricos como "Validate" si no tienen estado claro

## Modelos

### incidents
Campos:
- id
- user_id nullable
- type string
- title string nullable
- description text
- latitude decimal nullable
- longitude decimal nullable
- approximate_address string nullable
- neighborhood string nullable
- city string nullable
- state string nullable
- occurred_at datetime nullable
- status string default pending
- confidence_score unsignedTinyInteger default 0
- visibility_radius integer default 250
- is_anonymous boolean default true
- is_public boolean default false
- duplicate_of_id nullable
- reviewed_by nullable
- reviewed_at nullable
- created_at
- updated_at

### incident_evidences
Campos:
- id
- incident_id
- file_path
- file_type nullable
- original_filename nullable
- mime_type nullable
- size nullable
- status string default pending
- created_at
- updated_at

### incident_votes
Campos:
- id
- incident_id
- user_id nullable
- vote_type string
- ip_hash nullable
- created_at
- updated_at

vote_type:
- confirm
- false_report

### incident_status_logs
Campos:
- id
- incident_id
- previous_status nullable
- new_status
- changed_by nullable
- reason text nullable
- created_at
- updated_at

## Estados

Usar estos estados internos:

- pending
- visible_unverified
- community_validated
- evidence_validated
- externally_confirmed
- rejected
- duplicated
- hidden

Labels públicos:

- pending: Pendiente
- visible_unverified: No verificado
- community_validated: Validado por comunidad
- evidence_validated: Validado con evidencia
- externally_confirmed: Confirmado
- rejected: Rechazado
- duplicated: Duplicado
- hidden: Oculto

## Confidence score

Implementar función simple:

- +20 si tiene evidencia aprobada
- +20 si usuario está registrado
- +20 si tiene 2 o más confirmaciones
- +20 si fue validado por moderador
- +20 si está confirmado externamente

Máximo 100.

## Rutas sugeridas

Públicas:
- GET /
- GET /view_map
- GET /report_incident_form
- POST /reports
- GET /reports/{incident}

Interacciones:
- POST /reports/{incident}/votes
- POST /reports/{incident}/evidences

Admin:
- GET /admin/reports
- GET /admin/reports/{incident}
- PATCH /admin/reports/{incident}/status
- PATCH /admin/evidences/{evidence}/status

Rutas implementadas actualmente:
- `GET /` -> `welcome`
- `GET /view_map` -> `view_map`
- `GET /report_incident_form` -> `report_incident_form`
- `GET /dashboard` -> `dashboard` autenticado

## Componentes React/Inertia sugeridos

Layout:
- AppLayout
- PublicLayout
- PublicHeader
- PublicFooter

Landing:
- HeroSection
- FeatureCard
- ReportStatusSection

Mapa:
- ViewMapPage
- IncidentFilters
- IncidentMapPlaceholder
- IncidentMarker
- IncidentDetailPanel
- ConfidenceBadge
- StatusBadge

Reporte:
- ReportIncidentFormPage
- IncidentForm
- IncidentTypeSelector
- LocationPickerPlaceholder
- EvidenceUploader
- PrivacyNotice

Admin:
- AdminLayout
- ModerationQueue
- AdminIncidentTable
- AdminIncidentDetailPanel
- ModerationActions
- ModeratorNotes

## Reglas de privacidad

- No mostrar ubicación exacta públicamente.
- Mostrar dirección aproximada.
- No mostrar datos del usuario reportante.
- No publicar evidencia hasta que sea aprobada.
- Permitir reportes anónimos.
- No permitir acusaciones contra personas específicas.
- No permitir doxxing, placas visibles o rostros sin moderación.

## Seeders
Crear datos demo sobrios y ficticios.

Evitar:
- armas explícitas
- violencia gráfica
- personas identificables
- textos amarillistas

Ejemplos:
- "Reporte de robo de teléfono cerca de zona comercial"
- "Intento de robo reportado cerca de parada de transporte"
- "Cristalazo reportado en estacionamiento público"

## Primera entrega esperada

Implementar:
- migraciones
- modelos
- factories
- seeders
- rutas
- controllers básicos
- páginas Inertia:
  - Landing
  - Mapa
  - Crear reporte
  - Admin moderación
- componentes base
- badges de estado
- cálculo inicial de confidence_score
- subida básica de evidencia usando Laravel Storage

Ya implementado visualmente:
- landing pública funcional
- navegación pública entre landing, mapa y formulario
- layout público base
- badges reutilizables para estado y confianza
- tema claro como default
- adaptación inicial de las vistas Stitch a TSX/Inertia

No implementar todavía:
- Google Maps real
- Mapbox real
- notificaciones push
- analytics
- API pública
- validación con autoridad
- pagos
- app móvil
