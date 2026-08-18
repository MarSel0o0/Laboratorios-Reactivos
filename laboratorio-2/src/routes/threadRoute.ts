import { Router } from "express";
import { getAllThreads, saveNewThread, getHome } from "../controller/threadsController";


const router = Router();

/**  escriba aca sus rutas **/
router.get("/data.json", getAllThreads);
router.get("/", getHome);
router.post("/new", saveNewThread);

export default router;