import PostModel from "../models/posts";
import type { Post } from "../models/posts";

const normalizeText = (text: string) =>
  text.toLowerCase().replace(/\p{P}/gu, " ");

const wordsOf = (text: string) =>
  normalizeText(text).trim().split(/\s+/).filter(Boolean);

export const filterPostsByWord = (posts: Post[], query: string): Post[] => {
  const queryWords = wordsOf(query);

  if (queryWords.length !== 1) {
    return [];
  }

  return posts.filter((post) => wordsOf(post.content).includes(queryWords[0]));
};
