import { Router } from "express";
import Thread from "../models/Thread";

const router = Router();

// P2

/**
* se registra un endpoint GET en la ruta "/data.json"
* callback "async" porque se utiliza "await" para esperar la respuesta de consulta a mongoDB, 
* (operación asíncrona - no instantánea)
* @param {Request} req - obj de la request entrante, no se usa en este caso
* @param {Response} res - objeto usado para construir y enviar la respuesta
* @returns {Promise<void>} responde con un arreglo JSON de los threads o un error si falla 
*                          la consulta a la base de datos
* @throws {Error} si ocurre un problema al consultar mongoDB
*/
router.get("/data.json", async (req, res) => {
  try {
    // Thread.find({}) le pide a mongoose todos los docs de "threads" sin ningun filtro
	// "await" pausa la ejecución hasta que mongo responda
    const threads = await Thread.find({});
    return res.json(threads);
  } catch (err) {
    console.error(err);
    // código de estado HTTP 500 ("Internal server error")
    return res.status(500).json({ error: "Error al obtener los threads" });
  }
});

export default router;