import { Router } from "express";
import Thread from "../models/Thread";


const router = Router();

/**  escriba aca sus rutas **/
router.get("/data.json", async (req, res) => {
  try {
    const threads = await Thread.find();
    return res.json(threads);
  } catch (error) {
    console.error("Error encontrando threads:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;