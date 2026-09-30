import type { Post } from "../../src/models/posts"
import { after, beforeEach, describe, test } from "node:test";
import mongoose, { get } from "mongoose";
import supertest from "supertest";
import app from "../../src/app";
import assert from "node:assert";
import {initialPosts ,initialComments} from "../utils/data";
import PostModel from "../../src/models/posts";
import {
  postsInDB,
  postId,
  threadsInDB,
  threadCommentsInDB,
} from "../utils/helpers";

const api = supertest(app);

beforeEach(async () => {
    await PostModel.deleteMany({});
    await PostModel.insertMany(initialPosts);

  const initial_posts = await postsInDB();
  for (const post of initial_posts) {
    await PostModel.insertMany(
      initialComments.map((comment) => ({ ...comment, thread: post.id })),
    );
  }
});

describe("Test Posts",()=>{

          /*P2*/
          test("all posts are returned", async () => {
              const posts= await postsInDB();
              assert.strictEqual(posts.length, 12);
          });

          test("all comments are returned", async () => {
              const thread_id = await postId();
              const comments= await threadCommentsInDB(thread_id.toString());
              assert.strictEqual(comments.length, 3);
          });
          /*P3*/
          test("Post identifiers are named id, and  _id and _v are not present", async () => {
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

  after(async () => {
    await mongoose.connection.close();
  });

});
