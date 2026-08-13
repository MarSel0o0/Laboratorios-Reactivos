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

export default router;
