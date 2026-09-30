import { Post } from "../models/posts";

export function filterPostsByWord(posts: Post[], query: string): Post[] {
  if (!query) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const contentWords = post.content.toLowerCase().split(/\W+/);
    return contentWords.includes(lowerCaseQuery);
  });

  return filteredPosts;
}
