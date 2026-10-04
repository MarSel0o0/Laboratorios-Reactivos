import mongoose from "mongoose";
import PostModel from "../../src/models/posts";

const firstThreadId = new mongoose.Types.ObjectId();
const secondThreadId = new mongoose.Types.ObjectId();

const initialPosts = [
  {
    id: firstThreadId,
    content: "Este post contiene la 'PALAbra? clave",
    author: "John Doe",
    thread: null,
  },
  {
    id: secondThreadId,
    content: "Este post contiene la Palabra! clave",
    author: "Jane Doe",
    thread: null,
  },
  {
    content: "Este post contiene la palabra clave",
    author: "John Doe",
    thread: firstThreadId,
  },
  {
    content: "Este post contiene la 'palabra' clave, pero con puntuación.",
    author: "John Doe",
    thread: secondThreadId,
  },
  {
    content: "Este post no agarra la pala",
    author: "John Doe",
    thread: firstThreadId,
  },
];

const postsInDb = async () => {
  const posts = await PostModel.find({});
  return posts.map((post) => post.toJSON());
};

export default { initialPosts, postsInDb };
