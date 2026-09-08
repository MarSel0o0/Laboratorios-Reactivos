import mongoose from "mongoose";

const mongoUrl = process.env.MONGODB_URI;

mongoose
  .connect(mongoUrl || "")
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log(`error connecting to MongoDB: ${error.message}`));

const forbiddenAuthors = ["Huevito rey", "Matías Toro", "Memes es mal ramo"];

const postSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300,
    },
    author: {
      type: String,
      default: null,
      validate: {
        validator: (value: string | null) => {
          if (value === null) return true;
          return !forbiddenAuthors.includes(value);
        },
        message: (props: { value: string }) => `${props.value} no puede ser autor de un comentario`,
      },
    },
    thread: {
      type: Number,
      default: null,
    },
    parent: {
      type: Number,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

postSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: { _id?: mongoose.Types.ObjectId, __v?: number },
  ) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Post = mongoose.model("Post", postSchema);