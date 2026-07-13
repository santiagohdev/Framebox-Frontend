# FrameBox — Frontend

Aplicación React (Vite) para gestionar tu biblioteca personal de películas: registro con verificación de email, login, dashboard con estadísticas, CRUD de películas y géneros, favoritos.

## Tecnologías
React 19 · React Router 7 · Axios · Vite

## Estructura
```
src/
 ├─ api/          # instancia axios + interceptores
 ├─ components/   # Navbar, MovieCard, Modal, Button, Input, StarRating, ProtectedRoute, Loading
 ├─ context/       # AuthContext (token, login/logout)
 ├─ pages/        # Home, Login, Register, Dashboard, Movies, MovieDetail, Favorites, Genres
 └─ styles/       # variables, base, layout, components, pages (CSS organizado por capa)
```

## Instalación
```bash
npm install
cp .env.example .env   # apuntar VITE_API_URL al backend
npm run dev
```

## Variables de entorno
| Variable | Descripción |
|---|---|
| VITE_API_URL | URL base de la API (ej: `http://localhost:4000/api`) |

## Rutas
| Ruta | Acceso |
|---|---|
| `/` | Pública — landing (redirige a `/dashboard` si hay sesión) |
| `/login`, `/register` | Públicas |
| `/dashboard` | Protegida |
| `/movies`, `/movies/:id` | Protegidas |
| `/favorites` | Protegida |
| `/genres` | Protegida |

La sesión se guarda como JWT en `localStorage`. Si expira, el interceptor de axios limpia el token y redirige a `/login` automáticamente.

## Deploy (Vercel / Netlify)
1. Subir el repo a GitHub.
2. Importar el proyecto en Vercel/Netlify apuntando a la carpeta `framebox-frontend`.
3. Build command: `npm run build` — Output directory: `dist`.
4. Configurar la variable de entorno `VITE_API_URL` con la URL del backend deployado.
