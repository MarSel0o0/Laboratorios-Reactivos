import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const PORT = process.env.PORT || 7064;
app.listen(PORT, () => {
  console.log(`app running in port ${PORT}`);
});
