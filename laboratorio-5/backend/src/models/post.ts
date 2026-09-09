import mongoose from "mongoose";
const url = process.env.MONGODB_URI;
const db = process.env.MONGODB_DBNAME;
mongoose
  .connect(`${url}/${db}` || "mongodb://localhost:27017/lab5")
  .catch((error) => {
    console.log("Error al conectarse a MongoDB:", error.message);
  });

const forbiddenNames = ["Huevito Rey", "Matias Toro", "Memes es mal Ramo"];

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 1,
      maxLength: 300,
      required: true,
    },
    author: {
      type: String,
      default: "Anon",
      validate: {
        validator: (value: string) =>
          !forbiddenNames.some((name) => value === name),
        message: "Ese no puede ser el nombre del autor >:(",
      },
    },
    thread: Number,
    parent: Number,
    likes: {
      type: Number,
      required: false,
    },
    dislikes: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
);


postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const { _id, __v, ...rest } = returnedObject;
    return { ...rest, id: _id.toString() };
  },
});

export const Post = mongoose.model("Post", postSchema);
