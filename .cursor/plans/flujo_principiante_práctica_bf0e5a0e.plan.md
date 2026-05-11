---
name: Flujo Principiante práctica
overview: Paridad de layout con el workspace de Bloques (como en la referencia visual) para lenguajes en modo Principiante, más entrada directa a la lección guiada; Avanzado mantiene el flujo actual (overview o layout denso).
todos:
  - id: gate-initial-guided
    content: En LanguagePracticeShell, tryInitialGuidedSession solo con getTrackPracticeMode(lang) === 'beginner'; Avanzado → null (overview).
    status: completed
  - id: beginner-layout-parity
    content: Refactorizar GuidedLessonRunner (solo practiceMode === 'beginner') para que la estructura de columnas y sub-bloques coincida con PuzzleWorkspace en App.tsx.
    status: completed
  - id: smoke-check-flows
    content: Probar hub Principiante → runner con layout Bloques; Avanzado → overview y lección en layout avanzado.
    status: completed
isProject: false
---

# Modo Principiante = mismo “cascarón” que Bloques + Lienzo (referencia)

## Referencia (captura / `PuzzleWorkspace`)

Estructura deseada — solo para **lenguajes con `practiceMode === 'beginner'`** — alineada con [`PuzzleWorkspace`](d:/GitHub/ethan/src/App.tsx) (aprox. líneas 376–666):

- **Columna 1 (izquierda)**: dos bloques apilados en la misma `section` con `gap-4`.
  1. Tarjeta **Instrucciones** (mismo estilo de encabezado / panel que Bloques).
  2. Tarjeta **Lienzo** (`t('workspace.canvas')`) con el área de “resultado visual” o preview (en Bloques: rejilla; en lenguaje: el equivalente de salida / preview de la lección, sin renombrar a otro concepto en la cabecera).
- **Columna 2 (centro)**: un solo panel “**Tu código**” con la misma jerarquía que Bloques: fila de acciones (limpiar / reset del lienzo o salida / ejecutar), línea de **destino** si aplica, cuerpo con scroll de código o ejercicio.
- **Columna 3 (derecha)**: un **solo** `rounded-2xl` vertical que contiene, **en orden vertical**:
  1. Cabecera **Paleta** + hint corto (como Bloques).
  2. Zona scrollable de “herramientas” / analogía de bloques (`GuidedCanvasLienzo`, snippets, etc.).
  3. Separador `border-t` y debajo el **objetivo / patrón de referencia** (en Bloques: `InstructionVisualExample` + patrón objetivo; en lenguaje: meta de la lección, fragmentos esperados, vista de meta tipo stripe, etc., reubicados desde el diseño actual para ocupar el mismo hueco visual).

Proporciones de rejilla: reutilizar las mismas clases que ya comparten (`PRACTICE_GRID_BEGINNER` / grid de `GuidedLessonRunner` en modo beginner) para **no** cambiar anchos respecto al screenshot.

## Estado actual (gap)

[`GuidedLessonRunner`](d:/GitHub/ethan/src/app/guidedLesson/GuidedLessonRunner.tsx) en principiante coloca:

- Col1: instrucciones + tarjeta **“Vista previa del resultado”** (`guided.resultPreview`), no “Lienzo”.
- Col3: [`GuidedLessonToolsCard`](d:/GitHub/ethan/src/app/guidedLesson/GuidedLessonRunner.tsx) mezcla herramientas y meta en una sola tarjeta pero **no** replica el orden Paleta → borde → **patrón/objetivo** como en `PuzzleWorkspace`, ni la etiqueta “Paleta” como primera sección explícita igual que Bloques.

Objetivo del cambio: **misma anatomía de UI**, adaptando solo el contenido al tipo de ejercicio (texto, ordenar líneas, etc.).

## Cambios propuestos

### 1. Navegación / estado (sin tocar el hub)

- En [`LanguagePracticeShell.tsx`](d:/GitHub/ethan/src/app/LanguagePracticeShell.tsx): condicionar `tryInitialGuidedSession()` con `getTrackPracticeMode(lang)` desde [`learningPreferences.ts`](d:/GitHub/ethan/src/app/learningPreferences.ts): solo auto-abrir lección `0` si modo **`beginner`**; si **`advanced`**, `guidedSession` inicial `null` (overview).

### 2. Paridad visual con Bloques (solo `practiceMode === 'beginner'`)

- Refactorizar el `main` de `GuidedLessonRunner` cuando `isBeginnerLayout`:
  - Renombrar / unificar copy de la segunda tarjeta de la columna 1 para usar **`workspace.canvas`** (o clave i18n equivalente compartida) si el producto quiere literalmente el mismo título que Bloques; mantener accesibilidad.
  - Reestructurar la **columna 3** para seguir el patrón de `PuzzleWorkspace`: bloque Paleta + scroll + `border-t` + bloque objetivo/referencia (extraer fragmentos de `GuidedLessonToolsCard` o composición nueva para no duplicar lógica de ejercicio).
  - Alinear **columna 2** con la misma secuencia de elementos que Bloques (botones, alertas, “destino”, área de trabajo); reutilizar estilos existentes en App donde tenga sentido sin acoplar estado del motor de bloques.

### 3. Fuera de alcance explícito

- No sustituir el ejercicio de lenguaje por el motor de bloques del canvas (`BlocksUI` / `BlockPalette`) salvo requisito nuevo: la captura es **plantilla de layout**, no obligación de mismos bloques físicos.
- Modo **Avanzado**: no forzar este layout denso de Paleta+patrón; mantener el layout actual de avanzado en `GuidedLessonRunner`.

## Archivos previstos

- [`src/app/LanguagePracticeShell.tsx`](d:/GitHub/ethan/src/app/LanguagePracticeShell.tsx) — gate inicial por modo.
- [`src/app/guidedLesson/GuidedLessonRunner.tsx`](d:/GitHub/ethan/src/app/guidedLesson/GuidedLessonRunner.tsx) — reorganización UI beginner + posible extracción de subcomponentes.
- [`src/i18n/messages.ts`](d:/GitHub/ethan/src/i18n/messages.ts) — solo si hace falta una clave compartida “Lienzo” vs textos guiados actuales.
- Referencia de maquetación: [`src/App.tsx`](d:/GitHub/ethan/src/App.tsx) (`PuzzleWorkspace`).
