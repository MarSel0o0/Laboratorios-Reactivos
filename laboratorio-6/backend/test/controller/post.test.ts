import { after, beforeEach, describe, test } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import assert from "node:assert";
import app from "../../src/app";

import { initialPosts, initialComments } from "../utils/data";
import {
  postsInDB,
  postId,
  threadsInDB,
  threadCommentsInDB,
} from "../utils/helpers";

import postModel from "../../src/models/posts";

const api = supertest(app);

beforeEach(async () => {
  await postModel.deleteMany({});
  await postModel.insertMany(initialPosts);

  const posts = await postsInDB();
  for (const post of posts) {
    await postModel.insertMany(
      initialComments.map((comment) => ({ ...comment, thread: post.id })),
    );
  }
});

describe("posts", () => {
  describe("getting", () => {
    test("Post identifiers are named id, _id and _v are not present", async () => {
      const posts = await postsInDB();
      for (const post of posts) {
        assert.ok(post.id);
        assert.strictEqual(post._id, undefined);
        assert.strictEqual(post.__v, undefined);
      }
    });

    test("Non existent thread returns 404", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.get(`/api/threads/${nonExistentId}`).expect(404);
    });

    test("Invalid thread id returns 400", async () => {
      await api.get("/api/threads/invalid-id").expect(400);
    });

    test("Request to nonexistent endpoint returns 404 with error message", async () => {
      const response = await api.get("/api/nonexistent").expect(404);
      assert.strictEqual(response.body.error, "Not Found");
    });

    test("All threads are returned", async () => {
      const response = await api.get("/api/threads").expect(200);
      assert.strictEqual(response.body.length, initialPosts.length);
    });

    test("All comments of a thread are returned", async () => {
      const id = await postId();
      const response = await api.get(`/api/threads/${id}`).expect(200);
      assert.strictEqual(response.body.comments.length, initialComments.length);
      assert.strictEqual(response.body.thread.id, id);
    });
  });

  describe("creating", () => {
    test("Valid thread is created successfully", async () => {
      const oldPosts = await postsInDB();

      const newPost = {
        content: "This is a new thread",
        author: "New Author",
      };

      const response = await api.post("/api/threads").send(newPost).expect(201);

      const newPosts = await postsInDB();

      assert.strictEqual(newPosts.length, oldPosts.length + 1);
      assert.strictEqual(response.body.content, newPost.content);
      assert.strictEqual(response.body.author, newPost.author);
    });

    test("Valid comment is created successfully", async () => {
      const id = await postId();
      const oldPosts = await postsInDB();

      const newComment = {
        content: "This is a new comment",
        author: "Comment Author",
      };

      const response = await api
        .post(`/api/threads/${id}`)
        .send(newComment)
        .expect(201);

      const newPosts = await postsInDB();

      assert.strictEqual(newPosts.length, oldPosts.length + 1);
      assert.strictEqual(response.body.content, newComment.content);
      assert.strictEqual(response.body.author, newComment.author);
      assert.strictEqual(response.body.thread, id);
    });

    test("Creating a thread with content longer than 300 characters returns 400", async () => {
      const oldPosts = await postsInDB();

      const longContent = "a".repeat(301);
      const newPost = {
        content: longContent,
        author: "New Author",
      };

      await api.post("/api/threads").send(newPost).expect(400);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length);
    });

    test("Creating a comment with content longer than 300 characters returns 400", async () => {
      const id = await postId();
      const oldPosts = await postsInDB();

      const longContent = "a".repeat(301);
      const newComment = {
        content: longContent,
        author: "New Author",
      };

      await api.post(`/api/threads/${id}`).send(newComment).expect(400);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length);
    });

    test("Creating a thread with empty content returns 400", async () => {
      const oldPosts = await postsInDB();

      const newPost = {
        content: "",
        author: "New Author",
      };

      await api.post("/api/threads").send(newPost).expect(400);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length);
    });

    test("Creating a comment with empty content returns 400", async () => {
      const id = await postId();
      const oldPosts = await postsInDB();

      const newComment = {
        content: "",
        author: "New Author",
      };

      await api.post(`/api/threads/${id}`).send(newComment).expect(400);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length);
    });

    test("Creating a comment with a non-existent thread id returns 404", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const oldPosts = await postsInDB();

      const newComment = {
        content: "This is a new comment",
        author: "New Author",
      };

      await api
        .post(`/api/threads/${nonExistentId}`)
        .send(newComment)
        .expect(404);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length);
    });

    test("Creating a comment with a parent not part of the thread returns 400", async () => {
      const oldPosts = await postsInDB();
      const threads = await threadsInDB();
      const otherComment = await threadCommentsInDB(threads[1].id!);

      const newComment = {
        content: "This is a new comment",
        author: "New Author",
        parent: otherComment[0].id, // Parent from a different thread
      };

      await api
        .post(`/api/threads/${threads[0].id}`)
        .send(newComment)
        .expect(400);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length);
    });

    test("Creating a comment with a parent from the same thread is successful", async () => {
      const oldPosts = await postsInDB();
      const threads = await threadsInDB();
      const comments = await threadCommentsInDB(threads[0].id!);

      const newComment = {
        content: "This is a new comment",
        author: "New Author",
        parent: comments[0].id, // Parent from the same thread
      };

      const response = await api
        .post(`/api/threads/${threads[0].id}`)
        .send(newComment)
        .expect(201);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length + 1);
      assert.strictEqual(response.body.content, newComment.content);
      assert.strictEqual(response.body.author, newComment.author);
    });

    test("Creating a thread with no author is successfull", async () => {
      const oldPosts = await postsInDB();

      const newPost = {
        content: "This is a new thread",
      };

      const response = await api.post("/api/threads").send(newPost).expect(201);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length + 1);
      assert.strictEqual(response.body.content, newPost.content);
      assert.strictEqual(response.body.author, undefined);
    });

    test("Creating a comment with no author is successfull", async () => {
      const id = await postId();
      const oldPosts = await postsInDB();

      const newComment = {
        content: "This is a new comment",
      };

      const response = await api
        .post(`/api/threads/${id}`)
        .send(newComment)
        .expect(201);

      const newPosts = await postsInDB();
      assert.strictEqual(newPosts.length, oldPosts.length + 1);
      assert.strictEqual(response.body.content, newComment.content);
      assert.strictEqual(response.body.author, undefined);
    });

    test("Creating a thread with a banned author returns 400", async () => {
      const oldPosts = await postsInDB();

      const bannedAuthors = ["Huevito Rey", "Matías Toro", "Memes es mal ramo"];

      for (const author of bannedAuthors) {
        const newPost = {
          content: "This is a new thread",
          author: author,
        };

        await api.post("/api/threads").send(newPost).expect(400);

        const newPosts = await postsInDB();
        assert.strictEqual(newPosts.length, oldPosts.length);
      }
    });

    test("Creating a comment with a banned author returns 400", async () => {
      const id = await postId();
      const oldPosts = await postsInDB();

      const bannedAuthors = ["Huevito Rey", "Matías Toro", "Memes es mal ramo"];

      for (const author of bannedAuthors) {
        const newComment = {
          content: "This is a new comment",
          author: author,
        };

        await api.post(`/api/threads/${id}`).send(newComment).expect(400);

        const newPosts = await postsInDB();
        assert.strictEqual(newPosts.length, oldPosts.length);
      }
    });
  });
  after(async () => {
    await mongoose.connection.close();
  });
});
