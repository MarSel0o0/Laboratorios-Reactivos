import { Post } from "../../src/models/posts";
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 48 hours ago

export const initialPosts: Post[] = [
  {
    content: "Palabra del test 1",
    author: "Seba",
    createdAt: now,
    updatedAt: now,
    likes: 0,
    dislikes: 0,
  },
  {
    content: "PALABRA del test 2.",
    author: "Dani",
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    likes: 5,
    dislikes: 1,
  },
  {
    content: "palabra, del test 3",
    author: "Dani",
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    likes: 5,
    dislikes: 1,
  },
];


export const initialComments: Post[] = [
  {
    content: "Comentario chill",
    author: "Seba",
    createdAt: now,
    updatedAt: now,
    likes: 0,
    dislikes: 0,
  },
  {
    content: "Comentario con palabra",
    author: "Dani",
    createdAt: now,
    updatedAt: now,
    likes: 0,
    dislikes: 0,
  },
  {
    content: "Comentario con word",
    author: "Tomas Emilio",
    createdAt: now,
    updatedAt: now,
    likes: 0,
    dislikes: 0,
  },

  
];