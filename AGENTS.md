# Instrucciones para Agentes de IA (SNAK! Web)

## 1. Contexto del Proyecto
Estás asistiendo en el desarrollo de **SNAK**, una red social altamente interactiva centrada en la reproducción de video. La plataforma incluye un sistema de tokens para compras internas, comentarios y características sociales avanzadas. 
Prioriza el rendimiento, la experiencia móvil (responsive design) y la escalabilidad (preparado para HLS).

## 2. Stack Tecnológico Estricto
- **Framework:** Next.js (App Router exclusivo, no uses Pages Router).
- **Lenguaje:** TypeScript estricto.
- **Gestor de Paquetes:** `pnpm` (NUNCA sugieras comandos con `npm` o `yarn`).
- **Estilos:** Tailwind CSS.
- **Tailwind CSS v4:** El proyecto utiliza Tailwind v4. NO busques ni intentes crear un archivo `tailwind.config.ts`. Cualquier configuración de tema, colores personalizados o breakpoints debe hacerse mediante la directiva `@theme` en el archivo `src/app/globals.css`.
- **Componentes UI Base:**: Uso OBLIGATORIO de Shadcn/ui. No construyas componentes primitivos desde cero (Ejemplo: Buttons, inputs, modals, cards, etc.) siempre intenta utilizar los que te muesta https://ui.shadcn.com/docs/components.
- **Estado del Servidor/Fetching:** TanStack Query (`@tanstack/react-query`).
- **Formularios y Validación:** React Hook Form + Zod.
- **Reproductor de Video:** `react-player` (Optimizado para lazy loading).

## 3. Reglas de Arquitectura y Estructura
- **Tipografía:** Uso obligatorio de CHERRY BOMB o JOST segun sea indicado.
- **Responsive Design (Mobile First):** Diseña SIEMPRE pensando primero en pantallas móviles. Escribe las clases base de Tailwind para celular, y utiliza los breakpoints (`md:`, `lg:`, `xl:`) exclusivamente para adaptar el diseño a pantallas más grandes. NUNCA programes pensando en escritorio primero.
- Utiliza la arquitectura por "Features" (Ej: `src/features/auth`, `src/features/videos`), cada "feature" debe manejar su carpeta "components", "hooks", "services" e "interfaces".
- Mantén la interfaz de usuario limpia delegando la lógica de negocio a Custom Hooks (ej. `useLogin.ts`, `useSeries.ts`).
- **Archivos de Barril:** Utiliza archivos `index.ts` en las carpetas principales (como "components", "hooks", "services" e "interfaces") para exportar módulos limpios y evitar importaciones espagueti.
- El directorio `app/` debe contener principalmente rutas y layouts, delegando la construcción visual a los componentes dentro de `src/features` o `src/components`.
- **Assets e Iconografía (Dual-Stack):**
  1. **Imágenes estáticas:** Guárdalas siempre en `public/images/`.
  2. **Iconos de Interfaz (Lucide React):** Uso OBLIGATORIO para UI, acciones y navegación. Importa siempre como componentes de React (ej. `import { Menu } from 'lucide-react'`). NUNCA uses SVGs crudos para la interfaz. Estilízalos con Tailwind v4 (ej. `className="size-5 text-zinc-500"`).
  3. **Iconos Expresivos/Emojis (OpenMoji):** Uso exclusivo para contenido decorativo, gamificación o reacciones (ej. categorías, insignias de tokens). Descarga los SVGs de OpenMoji, guárdalos en `public/icons/openmoji/` y renderízalos SIEMPRE usando el componente `<Image />` de Next.js para optimización automática. No alteres sus colores originales.

## 4. Patrones de Código y "Anti-Patrones"
- **Componentes Primitivos:** NUNCA construyas elementos base (Buttons, Inputs, Modals/Dialogs, Cards, Dropdowns, etc.) usando solo código HTML y Tailwind puro. Debes usar o sugerir SIEMPRE el componente correspondiente de `shadcn/ui`. Si asumes que el componente no está en mi proyecto, dame el comando exacto para agregarlo (ej. `pnpm dlx shadcn@latest add button`).
- **Server vs. Client Components:** Por defecto, TODOS los componentes deben ser Server Components. NUNCA pongas `'use client'` en un archivo `page.tsx` o `layout.tsx`. Utiliza `'use client'` ÚNICAMENTE en "componentes hoja" (los más pequeños del árbol) que requieran interactividad (`onClick`, `useState`, `useEffect`, o librerías del navegador).
- **Fetching:** NUNCA uses `useEffect` para hacer peticiones fetch a la API. Utiliza siempre `useQuery` para lectura y `useMutation` para escritura/formularios.
- **Formularios:** No utilices estados controlados (`useState`) para los inputs de los formularios. Usa siempre el `<Controller>` de React Hook Form conectado a los esquemas de Zod.
- **Videos:** No uses el tag `<video>` nativo a menos que sea estrictamente necesario. Prefiere `react-player` con el prop `light` activo para mostrar el thumbnail y ahorrar ancho de banda inicial.
- **Autenticación:** Las llamadas a la API que fallen por credenciales incorrectas o usuario no encontrado siempre serán tratadas como un `401 Unauthorized` para evitar enumeración de usuarios.

## 5. Respuestas de la IA
- Sé conciso y directo al grano.
- Escribe el código asumiendo que ya tengo los imports de React/Next configurados, a menos que sea una librería nueva.
- Si vas a sugerir instalar un paquete, incluye el comando exacto usando `pnpm add <paquete>`.

## 6. Identidad Visual (SNAK! Palette)
- **Paleta Oficial:** Uso estricto de los colores definidos mediante variables CSS en `globals.css`. NUNCA hardcodear códigos Hexadecimales en los componentes.
    - **Pink:** `--color-snak-pink` (#BF0FB4) -> Uso para acentos y estados activos.
    - **Medium Purple:** `--color-snak-purple-medium` (#48038C) -> Uso para branding y elementos secundarios.
    - **Dark Purple:** `--color-snak-purple-dark` (#2E0259) -> Color base para fondos (Dark Mode) y capas profundas.
    - **Sky Blue:** `--color-snak-blue-sky` (#0798F2) -> Uso para enlaces, info y contrastes.
    - **Aqua Blue:** `--color-snak-blue-aqua` (#11C5D9) -> Uso para highlights y elementos vibrantes.
- **Implementación:** Al aplicar estilos con Tailwind v4, usa las variables registradas (ej. `bg-snak-pink`, `text-snak-blue-sky`).