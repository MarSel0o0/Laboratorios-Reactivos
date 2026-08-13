import { Router } from "express";
import path from "path";
import Thread from "../models/Thread";

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/data.json", async (req, res) => {
  try {
    const threads = await Thread.find({});
    return res.json(threads);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los hilos" });
  }
});

router.post("/new", async (req, res) => {
  try {
    const { author, content } = req.body;
    const newThread = await Thread.create({ author, content });
    return res.status(201).json(newThread);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el hilo" });
  }
});

export default router;
