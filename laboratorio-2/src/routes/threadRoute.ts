import { Router } from "express";
import { getThreads, createThread } from "../controller/threadsController";

const router = Router();

// P2
router.get("/data.json", getThreads);

// P4
router.post("/new", createThread);

export default router;