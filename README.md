# cv-frontend

Frontend del portafolio + panel de administración para mantener tu C.V y portafolio al día.

## Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **React Router** (rutas público/admin)
- **TanStack Query** (fetch y caché de datos)
- **Zustand** (estado global, incl. autenticación)
- **Axios** (cliente HTTP)
- **Tailwind CSS 4**
- **lucide-react** (iconos)

## Estructura

```
src/
  api/          # Cliente axios e interceptor de autenticación
  components/   # Componentes de portafolio y Dashboard
  layouts/      # Layout del dashboard con navegación
  pages/        # Vistas público y admin
  store/        # Zustand stores (auth)
  types/        # Tipos del dominio (CV)
  theme/        # Theme provider
```

### Páginas y dashboard

- **Portafolio público:** `PublicHome` (Héroe, Experiencia, Proyectos, Habilidades, Educación)
- **Admin:**
  - `ProfileDashboard` - perfil, contacto, redes sociales y foto
  - `ExperienceDashboard` - historial laboral
  - `ProjectDashboard` - proyectos y enlaces (repo frontend/backend)
  - `SkillDashboard` - habilidades por categoría
  - `EducationDashboard` - formación académica
  - `CVDashboard` - generador y descarga del CV en PDF

## Requisitos

- Node.js 18+ (Vite 8)
- La API corriendo (ver [`api-cv`](../api-cv/README.md))

## Variables de entorno (`.env`)

```
VITE_API_URL=http://localhost:5000/api
```

| Variable       | Descripción                                   |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | URL base de la API (termina en `/api`)        |

> En producción (Vercel) define `VITE_API_URL` apuntando a la API desplegada, p. ej. `https://tu-api.onrender.com/api`.

## Instalación

```bash
npm install
```

## Scripts

```bash
npm run dev      # Servidor de desarrollo (Vite) en http://localhost:5173
npm run build    # Compila TypeScript y genera el bundle de producción en dist/
npm run lint     # ESLint
npm run preview  # Sirve en local el build de producción
```

## Cómo usar

1. Levanta la API en el puerto `5000` (y siembra datos con `npm run seed`).
2. `npm run dev` para desarrollo.
3. Regístrate/ingresa desde el login del dashboard.
4. Edita los datos desde el panel de administración y descarga el C.V desde `CVDashboard`.

## Generador de CV (PDF)

Desde `CVDashboard` puedes generar y descargar tu currículum en PDF. Genera una ventana de impresión con el perfil, experiencia, educación, habilidades y proyectos en formato A4 siguiendo el estándar Harvard. Corrige cualquier espacio en blanco entre segmentos ajustando el CSS del bloque de estilos dentro de `src/pages/CVDashboard.tsx` (clase `.cv-section` y `.cv-item`).