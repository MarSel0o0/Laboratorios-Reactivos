import mongoose from "mongoose";

const FORBIDDEN_AUTHORS = ["Huevito rey", "Matías Toro", "Memes es mal ramo"];

const postSchema = new mongoose.Schema(
  {
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
        validator: function (value: string | null) {
          if (!value) return true;
          return !FORBIDDEN_AUTHORS.includes(value);
        },
        message: "El autor no está permitido."
      },
    },
    thread: {
      type: String,
      default: null,
    },
    parent: {
      type: String,
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
  { timestamps: true }
);

postSchema.set("toJSON", {
  transform: (
    _document,
    returnedObject: {
      id?: string | undefined;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Post = mongoose.model("Post", postSchema);
