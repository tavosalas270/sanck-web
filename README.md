# Snack - Frontend Web

Este repositorio contiene el código fuente del frontend web para **Snack**, una red social centrada en el streaming de videos y series, compra por medio de tokens, comentarios, reacciones y caracteristicas sociales avanzadas.

## 🛠️ Stack Tecnológico

*   **Framework:** [Next.js](https://nextjs.org/) (App Router exclusivo)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Configuración vía `@theme` en CSS)
*   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
*   **Gestión de Datos:** [TanStack Query v5](https://tanstack.com/query/latest)
*   **Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Iconografía:** [Lucide React](https://lucide.dev/) & [OpenMoji](https://openmoji.org/)
*   **Gestor de Paquetes:** [pnpm](https://pnpm.io/)


## 🏗️ Arquitectura

El proyecto sigue una **Arquitectura basada en Feature (Feature-based Architecture)**. En lugar de organizar el código solo por tipos de archivos (hooks, componentes, etc.), lo organizamos por módulos funcionales. 

Cada módulo dentro de la carpeta `components/` encapsula su propia lógica:
*   **`components/`**: UI específica del módulo.
*   **`hooks/`**: Lógica de estado y efectos propia de la feature.
*   **`services/`**: Llamadas a API y lógica de negocio.
*   **`schemas/`**: Definiciones de TypeScript para el módulo.

Esta estructura permite que el proyecto sea más escalable, fácil de testear y que los equipos trabajen en paralelo de forma más eficiente.

Adicionalmente, implementamos **archivos de barril (barrel files)** mediante archivos `index.ts` en cada subdirectorio. Esto garantiza importaciones más limpias, organizadas y fáciles de mantener al centralizar las exportaciones de cada módulo.


## 🚀 Guía de Instalación y Uso

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 📋 Requisitos Previos

Antes de comenzar, asegúrate de cumplir con lo siguiente:
*   **Backend:** El servidor backend debe estar en funcionamiento. Puede estar corriendo localmente o estar ya desplegado en un servidor.
*   **Node.js:** Tener instalado Node.js **v24.14.0** o superior.

### 1. Instalación de dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
pnpm install
```

## 🚀 Comenzando

Para ejecutar el servidor de desarrollo:

```bash
pnpm run dev
```
Finalmente, abrir la URL en el navegador: [http://localhost:3000](http://localhost:3000)
