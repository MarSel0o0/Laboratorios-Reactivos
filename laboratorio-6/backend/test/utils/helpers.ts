import postModel from "../../src/models/posts";

export const postsInDB = async () => {
  const posts = await postModel.find({});
  return posts.map((post) => post.toJSON());
};

export const postId = async (): Promise<String> => {
  const posts = await postModel.find({});
  return posts[0].id;
};

export const threadsInDB = async () => {
  const threads = await postModel.find({ thread: null });
  return threads.map((thread) => thread.toJSON());
};

export const threadCommentsInDB = async (threadId: string) => {
  const comments = await postModel.find({ thread: threadId });
  return comments.map((comment) => comment.toJSON());
};
