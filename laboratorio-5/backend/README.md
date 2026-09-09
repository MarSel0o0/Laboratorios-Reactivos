# Backend — Laboratorio 5

Esta carpeta se entrega **vacía a propósito**. Sigue estos pasos para reconstruir
el backend exactamente como está en la rama principal del laboratorio.

Stack: **Node.js + Express 5 + Mongoose 9 + TypeScript**, ejecutado con el runner
nativo de TypeScript de Node (`node --watch src/index.ts`). Gestor de paquetes:
**pnpm**.

---

## 1. Requisitos previos

- Node.js con soporte para ejecutar `.ts` directamente (Node 22.6+ con
  `--experimental-strip-types`, o Node 24+ donde ya es estable). El proyecto usa
  `node --watch src/index.ts` sin `ts-node`.
- [pnpm](https://pnpm.io/) 10.x (`corepack enable` o `npm i -g pnpm`).
- Una instancia de **MongoDB** accesible (local en `mongodb://127.0.0.1:27017` o la
  de la facultad, ver paso 5).

---

## 2. Estructura final de la carpeta

```
backend/
├── .env
├── .env.prod
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    └── models/
        └── post.ts
```

Crea las carpetas:

```bash
cd laboratorio-5/backend
mkdir -p src/models
```

---

## 3. Archivos de configuración

### `package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "build": "tsc",
    "start": "node out/index.js",
    "dev": "node --watch src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:ui": "rm -rf dist && cd ../frontend && pnpm run build && cp -r dist ../backend",
    "deploy:full": "pnpm run build:ui && git add . && git commit -m uibuild && git push"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.33.0",
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^26.4.1",
    "typescript": "^7.0.2"
  },
  "type": "module",
  "dependencies": {
    "@types/mongoose": "^5.11.97",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.9.4"
  }
}
```

### `tsconfig.json`

```jsonc
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    "rootDir": "./src",
    "outDir": "./out",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true
  }
}
```

---

## 4. Código fuente

### `src/models/post.ts`

```ts
import mongoose from "mongoose";
const url = process.env.MONGODB_URI;
const db = process.env.MONGODB_DBNAME;
mongoose
  .connect(`${url}/${db}` || "mongodb://localhost:27017/lab5")
  .catch((error) => {
    console.log("Error al conectarse a MongoDB:", error.message);
  });

const forbiddenNames = ["Huevito Rey", "Matias Toro", "Memes es mal Ramo"];

const postSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      minLength: 1,
      maxLength: 300,
      required: true,
    },
    author: {
      type: String,
      validate: {
        validator: (value: string) =>
          !forbiddenNames.some((name) => value === name),
        message: "Ese no puede ser el nombre del autor >:(",
      },
    },
    thread: Number,
    parent: Number,
    likes: {
      type: Number,
      required: true,
    },
    dislikes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

postSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      _id?: mongoose.Types.ObjectId;
      __v?: number;
    },
  ) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Post = mongoose.model("Post", postSchema);
```

### `src/index.ts`

```ts
import "dotenv/config";

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { Post } from "./models/post.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/threads", (req, res) => {
  Post.find({}).then((posts) => {
    res.json(posts);
  });
});

app.post("/api/threads", async (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    res.status(400).json({
      error: "content missing",
    });
  } else {
    const posts = await Post.find({});
    const ids = posts
      .map((p) => p.id)
      .filter((id) => typeof id === "number" && !Number.isNaN(id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const thread = {
      id: maxId + 1,
      content: body.content,
      author: body.author ?? null,
      thread: null,
      parent: null,
      likes: 0,
      dislikes: 0,
    };

    const threadToSave = new Post(thread);
    threadToSave
      .save()
      .then((savedPost) => res.json(savedPost))
      .catch((error) => next(error));
  }
});

app.get("/api/threads/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const thread = await Post.findOne({ id: id });
    if (!thread) {
      res.status(404).json({
        error: "Thread does not exist",
      });
    } else {
      const comments = await Post.find({ thread: id });
      res.json({ thread, comments });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/threads/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const thread = await Post.findOne({ id: id });

  if (!thread) {
    res.status(404).json({
      error: "Thread does not exist",
    });
  } else {
    const { content, author, parent } = req.body;

    if (!content) {
      res.status(400).json({
        error: "content missing",
      });
    } else {
      const posts = await Post.find({});
      const ids = posts
        .map((p) => p.id)
        .filter((id) => typeof id === "number" && !Number.isNaN(id));
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const thread = {
        id: maxId + 1,
        content: content,
        author: author ?? null,
        thread: id,
        parent: parent ?? null,
        likes: 0,
        dislikes: 0,
      };

      const threadToSave = new Post(thread);
      threadToSave
        .save()
        .then((savedPost) => res.json(savedPost))
        .catch((error) => next(error));
    }
  }
});

app.put("/api/posts/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const { content, author, thread, parent, likes, dislikes } = req.body;

  await Post.findOne({ id: id })
    .then((post) => {
      if (post) {
        post.content = content;
        post.author = author;
        post.thread = thread;
        post.parent = parent;
        post.likes = likes;
        post.dislikes = dislikes;

        post.save().then((updatedPost) => res.json(updatedPost));
      } else {
        res.status(400).json({
          error: "Post not found",
        });
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 7064;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 5. Variables de entorno

Estos archivos **no se versionan** (están en `.gitignore`). Créalos a mano.

### `.env` (desarrollo, MongoDB local)

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DBNAME=lab5
PORT=7064
HOST=0.0.0.0
```

### `.env.prod` (MongoDB del curso)

```env
MONGODB_URI=mongodb://fulls:fulls@fullstack.dcc.uchile.cl:27019
MONGODB_DBNAME=fullstack?authSource=admin
PORT=7064
HOST=0.0.0.0
```

> El código lee siempre `.env` vía `import "dotenv/config"`. Para usar la
> configuración de producción, copia `.env.prod` sobre `.env` o exporta las
> variables manualmente antes de arrancar.

---

## 6. Instalar dependencias

```bash
cd laboratorio-5/backend
pnpm install
```

Esto genera `pnpm-lock.yaml` / `node_modules` con las versiones declaradas en
`package.json`.

---

## 7. Ejecutar

Modo desarrollo (recarga en caliente, ejecuta TypeScript directo):

```bash
pnpm run dev
```

Compilar a JavaScript y correr el build:

```bash
pnpm run build   # tsc -> genera ./out
pnpm run start   # node out/index.js
```

El servidor queda escuchando en `http://localhost:7064`. Si existe una carpeta
`dist/` (build del frontend copiado con `pnpm run build:ui`), se sirve como
estático desde la raíz.

---

## 8. Endpoints

| Método | Ruta                  | Descripción                                              |
| ------ | --------------------- | ------------------------------------------------------- |
| GET    | `/api/threads`        | Lista todos los posts.                                  |
| POST   | `/api/threads`        | Crea un thread nuevo. Body: `{ content, author? }`.     |
| GET    | `/api/threads/:id`    | Devuelve `{ thread, comments }` de ese thread.          |
| POST   | `/api/threads/:id`    | Agrega un comentario al thread. Body: `{ content, author?, parent? }`. |
| PUT    | `/api/posts/:id`      | Actualiza un post completo (likes, dislikes, contenido…). |

Modelo `Post`: `id` (número autoincremental calculado en el backend, único),
`content` (1–300 chars), `author` (opcional, con lista de nombres prohibidos),
`thread` (id del thread padre, `null` si es raíz), `parent` (id del post al que
responde), `likes`, `dislikes`, y `timestamps` automáticos.
