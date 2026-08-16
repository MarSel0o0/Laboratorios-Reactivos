import { Request, Response } from "express";
import Thread from "../models/Thread";

/** implementación de los controladores para las rutas de hilos */

// P2
/**
 * obtiene todos los threads almacenados en la base de datos
 * y los devuelve como un arreglo JSON
 * callback "async" porque se utiliza "await" para esperar la respuesta de 
 * consulta a mongoDB, (operación asíncrona - no instantánea)
 * @param {Request} req - obj de la request entrante, no se usa en este caso
 * @param {Response} res - objeto usado para construir y enviar la respuesta
 * @returns {Promise<void>} responde con un arreglo JSON de los threads o un
 * error si falla la consulta a la base de datos
 * @throws {Error} si ocurre un problema al consultar mongoDB
 */
export const getThreads = async (req: Request, res: Response) => {
  try {
	// Thread.find({}) le pide a mongoose todos los docs de "threads" sin ningun filtro
	// "await" pausa la ejecución hasta que mongo responda
    const threads = await Thread.find({});
    return res.json(threads);
  } catch (err) {
    console.error(err);
    // código de estado HTTP 500 ("Internal server error")*
    return res.status(500).json({ error: "Error al obtener los threads" });
  }
};

// P4
/** implementación de los controladores para las rutas de hilos 
 * callback "async" porque se utiliza "await" para esperar la respuesta de mongoDB,
 * (operación asíncrona - no instantánea)
 * @param {Request} req - obj de la request entrante, contiene los datos en req.body
 * @param {Response} res - objeto usado para construir y enviar la respuesta
 * @returns {Promise<void>} responde el thread creado o error
 * @throws {Error} si ocurre un problema al crear el thread
 */
export const createThread = async (req: Request, res: Response) => {
  try {
	// se extrae el autor y contenido del cuerpo de la request
    const { author, content } = req.body;
    // se crea una nueva instancia del modelo de Thread y la guarda en MongoDB
    // la fecha se genera automaticamente
    const thread = await Thread.create({ author, content });
    // código HTTP 201 "Created" se envía el thread recién creado como respuesta JSON
    return res.status(201).json(thread);
  } catch (err) {
    console.error(err);
    // 500 "Internal Server Error"
    return res.status(500).json({ error: "Error al crear el thread" });
  }
};