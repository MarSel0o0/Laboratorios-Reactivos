# Laboratorio 8 — Testing (unitario y end-to-end)

Aplicación de threads/comentarios (estilo imageboard) con:

- `backend/`: API REST en Express + TypeScript + MongoDB (Mongoose), autenticación con JWT.
- `frontend/`: React + Vite + Material UI.
- `e2e-tests/`: tests end-to-end con Playwright (añadido en este laboratorio).

Este documento resume, paso a paso, lo que se hizo durante el laboratorio a partir de los commits del día
(2026-11-03), desde `feat(P1)` hasta `feat(P6): done`.

## Resumen de commits

| # | Commit | Hora | Parte | Qué se hizo |
|---|--------|------|-------|-------------|
| 0 | `c5144e01` `feat: lab 8 added` | 13:34 | Base | Código base del laboratorio (backend + frontend) |
| 1 | `b9b6d114` `feat(P1): P1 finished` | 16:30 | P1 | Tests unitarios de `PostBox` |
| 2 | `6b4ca3d4` `feat(P2): done` | 18:34 | P2 | Test de interacción (like) y tests de `PostForm` |
| 3 | `b5c5fd93` `feat(P4): done` | 21:12 | P4 | Setup de Playwright, helpers y tests de login |
| 4 | `a3c1defb` `feat(P4): done` | 21:19 | P4 | Backend en modo test, endpoint de reset, `data-testid`/clases en el frontend |
| 5 | `27352232` `feat(P4): done` | 21:29 | P4 | Tests de logout y creación de thread como invitado |
| 6 | `0c667633` `feat(P5): done` | 21:49 | P5 | Autor por sesión y validación de contenido vacío |
| 7 | `fbde97e7` `feat(P6): done` | 22:10 | P6 | Tests de la página de un thread |

> Nota: el primer commit de la parte práctica se llama `feat(P1): P1 finished` (no `feat(P1): done`) y no existe
> un commit `feat(P3)`. Lo único relacionado con una posible P3 es la dependencia de cobertura
> (`@vitest/coverage-v8`), que quedó dentro de un commit de P4.

---

## P1 — Tests unitarios de `PostBox` (`b9b6d114`)

Se usa **Vitest** + **React Testing Library** (el entorno `jsdom` y `globals: true` ya estaban en `vite.config.ts`).

1. Se creó `frontend/src/components/PostBox.test.tsx` con un helper `makePost()` que construye un `Post` de
   prueba con valores por defecto y un helper `renderPostBox()` que envuelve el componente en un `MemoryRouter`
   (necesario porque `PostBox` renderiza links de `react-router-dom`).
2. Tests escritos:
   - Renderiza el contenido y el nombre del autor.
   - Renderiza `Anonymous` cuando el autor es `null`.
   - Renderiza el link con el ID del comentario al que responde (`>>3`).
   - No renderiza ninguna referencia (`>>`) si el post no responde a nadie.
3. Cambios menores en el código:
   - Se unificó el estilo de los imports de MUI (sin `;` al final) en `App.tsx`, `PostBox.tsx` y `Thread.tsx`.
   - Se actualizó `package-lock.json` del frontend.

## P2 — Tests de interacción y formulario (`6b4ca3d4`)

1. `PostBox.test.tsx`: se añadió un test con **`@testing-library/user-event`** que presiona dos veces el botón
   `like post` y verifica que `setToast` se llama dos veces con
   `{ message: 'Me gusta registrado', severity: 'success' }`. El servicio `threads` se reemplaza con
   `vi.mock('../services/threads')` para no hacer llamadas HTTP reales, y `threads.update` se resuelve con
   `mockResolvedValue`.
2. Se creó `frontend/src/components/PostForm.test.tsx` con dos tests: escribir nombre y comentario, presionar
   `Post` y comprobar que `onSubmit` recibe `{ content, author, parent }`:
   - como thread nuevo (`parent: undefined`);
   - como respuesta (con `parentId={1}` → `parent: 1`).
3. `frontend/testSetup.ts`: además de `cleanup()`, ahora se ejecuta `vi.clearAllMocks()` después de cada test para
   que los mocks no se filtren de un test a otro (y se normalizó el estilo del archivo).

## P4 — Tests end-to-end con Playwright (`b5c5fd93`, `a3c1defb`, `27352232`)

*(No hay commit de P3 en el historial; ver nota arriba.)*

### Commit 1 — Instalación y configuración (`b5c5fd93`)

1. Se creó el proyecto `e2e-tests/` con `@playwright/test`, `@types/node` y `mongodb`, scripts
   `npm test` (`playwright test`) y `npm run test:report`, además de `tsconfig.json` y `.gitignore`
   (ignora `test-results`, `playwright-report`, etc.).
2. `playwright.config.ts`:
   - `baseURL: http://localhost:5173`.
   - Proyecto `chromium` usando el Chromium del sistema (`/usr/bin/chromium`), ya que Playwright no soporta
     `--with-deps` en Arch.
   - `webServer` levanta automáticamente el backend (`npm run start:test`, en `../backend`) y el frontend
     (`npm run dev`, en `../frontend`), reutilizando los servidores si ya están corriendo.
3. `tests/helper.ts` con funciones reutilizables: `resetDb`, `createUser` y `login`.
4. `tests/post_app.spec.ts` con los primeros tests: render de `/threads`, **flujo exitoso** de inicio de sesión
   y **flujo erróneo** de inicio de sesión.

### Commit 2 — Backend en modo test y *hooks* del frontend (`a3c1defb`)

1. **Backend**
   - `package.json`: nuevo script `start:test` → `NODE_ENV=test tsx src/index.ts`.
   - `utils/config.ts`: si `NODE_ENV === 'test'`, usa la base de datos `MONGODB_DBNAME_TEST`
     (definida en `env.example`, `lab8-test`) en lugar de `MONGODB_DBNAME`; así los tests nunca tocan los datos reales.
   - `controllers/testing.ts` (nuevo): `POST /api/testing/reset` borra todos los posts y usuarios.
   - `app.ts`: el router de testing **solo se monta cuando `NODE_ENV === 'test'`**.
2. **Frontend**
   - `Login.tsx`: `data-testid` en los campos `username` y `password`, y `className="error"` en la alerta de error.
   - Se añadió `@vitest/coverage-v8` como dependencia de desarrollo.
3. El test de login erróneo pasó a usar `page.locator('.error')`.

### Commit 3 — Más flujos E2E (`27352232`)

1. Los tests se reorganizaron en bloques `describe`: `flujo login`, `when logged in` y `when not logged in`.
2. Frontend: `PostForm.tsx` recibe `data-testid="author"` y `data-testid="content"` en los inputs, y `PostBox.tsx`
   recibe `className="post"` en la `Card`, para poder seleccionar los posts en los tests.
3. Nuevos tests:
   - **Un usuario puede cerrar sesión**: vuelve a verse como invitado y la sesión no se restaura tras recargar.
   - **Un invitado puede crear un thread**: el post aparece con el autor indicado.
4. `helper.ts`: se añadió `createPost` (rellena el formulario de `/threads` y presiona `Post`).
5. `playwright.config.ts`: se fuerza `fullyParallel: false` y `workers: 1` (antes era paralelo), porque los tests
   comparten la misma base de datos.

## P5 — Autor por sesión y validación (`0c667633`)

1. `PostForm.tsx`: solo se unificó el estilo de los imports de MUI (sin `;`).
2. Nuevos tests E2E en `when logged in` / `when not logged in`:
   - **El autor del thread es el nombre de usuario de la sesión**: logueado como `marselo` y sin escribir autor,
     el post muestra `marselo` y no `Anonymous`.
   - **No se puede crear un thread con el contenido vacío**: se espera el mensaje `Han creado 0 threads!`,
     se intenta publicar sin contenido y se comprueba que no se creó ningún `.post`.

## P6 — Tests de la página de un thread (`fbde97e7`)

1. `helper.ts`: nuevo helper `createThread`, que crea un thread con sus comentarios llamando directamente a la API
   (`POST /api/threads` y `POST /api/threads/:id`), más los datos de ejemplo `sampleThread` y `sampleComments`.
   Esto evita depender de la UI para preparar el estado.
2. Nuevo bloque `thread page` en `post_app.spec.ts`. Antes de cada test se limpia la BD, se crea un thread con dos
   comentarios y se navega a `/threads/:id` esperando que haya 3 `.post`. Tests:
   - **Se muestran los comentarios del thread**: cada comentario aparece una vez con su autor y se ve
     `Han creado 2 comentarios!`.
   - **El contenido del thread se muestra al inicio del listado**: el primer `.post` es el thread y luego los
     comentarios, en orden de creación.
   - **Hay un formulario para crear comentarios al inicio de la página**: el formulario es visible, `content` es
     obligatorio y `author` opcional, ambos campos se pueden escribir, y en el DOM el formulario aparece antes que
     cualquier `.post`.

---

## Cómo ejecutar

### Configuración previa

Tener MongoDB corriendo y crear `backend/.env` a partir de `backend/env.example`:

```
PORT=3001
HOST=localhost
MONGODB_URI=mongodb://localhost:27017
MONGODB_DBNAME=lab8
MONGODB_DBNAME_TEST=lab8-test
JWT_SECRET=miclavesecreta
```

Instalar dependencias en cada subproyecto:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../e2e-tests && npm install
```

### Tests unitarios (P1 y P2)

```bash
cd frontend
npm test
```

### Tests end-to-end (P4, P5 y P6)

```bash
cd e2e-tests
npm test              # levanta backend (NODE_ENV=test) y frontend automáticamente
npm run test:report   # abre el reporte HTML
```

Los tests E2E usan la base de datos `MONGODB_DBNAME_TEST` y el endpoint `/api/testing/reset`
(solo disponible con `NODE_ENV=test`), por lo que no afectan los datos de desarrollo.
Ojo: `playwright.config.ts` apunta a `/usr/bin/chromium`; ajusta esa ruta si tu sistema lo instala en otro lugar.
