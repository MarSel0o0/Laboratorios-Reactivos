import { Post } from "../models/posts";

export default function filterPostByWord(posts: Post[], word: string): Post[] {
    const normalize = (value: string): string =>
        value
            .toLocaleLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, " ")
            .trim();

    const normalizedWord = normalize(word);

    if (!normalizedWord) {
        return [];
    }

    return posts.filter((post: Post) => {
        const content = normalize(post.content);
        return ` ${content} `.includes(` ${normalizedWord} `);
    });
}