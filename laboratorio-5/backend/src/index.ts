import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import "./models/posts";

const mongoUrl = process.env.MONGODB_URI;

// mongoose
//   .connect(mongoUrl || "")
//   .then(() => console.log("connected to MongoDB"))
//   .catch((error) => console.log(`error connecting to MongoDB: ${error.message}`));

const app = express();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});