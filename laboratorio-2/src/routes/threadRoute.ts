import { Router } from "express";
import path from "path";
import Thread from "../models/Thread";


const router = Router();

/**  escriba aca sus rutas **/

// P3: ruta principal. Entrega el archivo HTML de la SPA. El listado de
// threads NO se arma aquí en el servidor: el navegador lo pedirá aparte
// mediante AJAX a GET /data.json (ver public/spa.js).
router.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// P2: entrega todos los threads almacenados en Mongo como JSON.
router.get("/data.json", async (req, res) => {
  try {
    const threads = await Thread.find();
    return res.json(threads);
  } catch (error) {
    console.error("Error encontrando threads:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// P4: crea un thread nuevo a partir de { author, content } enviados en el
// body (JSON). No recibimos fecha: createdAt la genera mongoose solo por
// la opción "timestamps" configurada en el schema (P1).
router.post("/new", async (req, res) => {
  try {
    const { author, content } = req.body;
    const thread = await Thread.create({ author, content });
    return res.status(201).json(thread);
  } catch (error) {
    console.error("Error creando thread:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
