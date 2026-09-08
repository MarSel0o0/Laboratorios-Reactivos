import mongoose from "mongoose";

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

if (url) {
  mongoose
    .connect(url)
    .then(() => console.log("connected to MongoDB"))
    .catch((error) => {
      console.log("error connecting to MongoDB:", error.message);
    });
} else {
  console.log("MONGODB_URI is not set");
}
