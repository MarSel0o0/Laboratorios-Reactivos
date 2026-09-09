import "dotenv/config";

import express from "express";
import cors from "cors";
import threadsRouter from "./routes/threadsRouter.ts";
import { errorHandler } from "./middlware/errorHandler.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use("/api/threads", threadsRouter);
app.use(errorHandler);


const PORT = process.env.PORT || 7064;
app.listen(PORT, () => {
  console.log(`app running in port ${PORT}`);
});

