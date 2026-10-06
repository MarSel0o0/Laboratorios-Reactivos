import { describe, test, beforeEach, after } from "node:test";
import supertest from "supertest";
import mongoose from "mongoose";
import PostModel from "../../src/models/posts";
import app from "../../src/app";
import helper from "./test_helper";
import assert from "node:assert";
import request from "supertest";

const api = supertest(app);

describe("Integration tests for the API endpoints", () => {
  // P2

  beforeEach(async () => {
    await PostModel.deleteMany({});
    console.log("Cleared the database before each test");
    await PostModel.insertMany(helper.initialPosts);
    console.log("Inserted initial posts before each test");
  });

  test("GET /api/threads returns all threads", async () => {
    const response = await api
      .get("/api/threads")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const threadsInDb = await helper.postsInDb();
    assert.strictEqual(
      response.body.length,
      threadsInDb.filter((post) => post.thread === null).length,
    );
  });

  test("GET /api/threads/:id returns a specific thread with its comments", async () => {
    const threadsInDb = await helper.postsInDb();
    const threadId = threadsInDb[0].id;

    const response = await api
      .get(`/api/threads/${threadId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.thread.id, threadId);
  });

  // P3

  test("responses use id and do not include _id or __v", async () => {
    const threadsResponse = await api
      .get("/api/threads")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    threadsResponse.body.forEach((thread: Record<string, unknown>) => {
      assert.ok(thread.id);
      assert.strictEqual(thread._id, undefined);
      assert.strictEqual(thread.__v, undefined);
    });

    const threadId = threadsResponse.body[0].id;
    const threadResponse = await api
      .get(`/api/threads/${threadId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.ok(threadResponse.body.thread.id);
    assert.strictEqual(threadResponse.body.thread._id, undefined);
    assert.strictEqual(threadResponse.body.thread.__v, undefined);
    threadResponse.body.comments.forEach((comment: Record<string, unknown>) => {
      assert.ok(comment.id);
      assert.strictEqual(comment._id, undefined);
      assert.strictEqual(comment.__v, undefined);
    });
  });

  test("GET /api/threads/:id returns 404 for a valid id that does not exist", async () => {
    await api.get(`/api/threads/${new mongoose.Types.ObjectId()}`).expect(404);
  });

  test("GET /api/threads/:id returns 400 for a malformed id", async () => {
    await api
      .get("/api/threads/not-an-id")
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect({ error: "malformatted id" });
  });

  test("unknown routes return 404 with a JSON error", async () => {
    await api
      .get("/api/does-not-exist")
      .expect(404)
      .expect("Content-Type", /application\/json/)
      .expect({ error: "unknown endpoint" });
  });

  const creationEndpoints = [
    {
      name: "thread",
      path: "/api/threads",
    },
    {
      name: "comment",
      path: async () => {
        const postsInDb = await helper.postsInDb();
        return `/api/threads/${postsInDb[0].id}`;
      },
    },
  ];

  for (const endpoint of creationEndpoints) {
    test(`POST ${endpoint.name} with valid content creates exactly one post`, async () => {
      const postsBefore = await helper.postsInDb();
      const path =
        typeof endpoint.path === "function"
          ? await endpoint.path()
          : endpoint.path;

      const response = await api
        .post(path)
        .send({ content: "Contenido válido", author: "Test Author" })
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const postsAfter = await helper.postsInDb();
      assert.strictEqual(postsAfter.length, postsBefore.length + 1);
      assert.strictEqual(response.body.content, "Contenido válido");
    });

    test(`POST ${endpoint.name} without content returns 400 and does not create a post`, async () => {
      const postsBefore = await helper.postsInDb();
      const path =
        typeof endpoint.path === "function"
          ? await endpoint.path()
          : endpoint.path;

      await api.post(path).send({ author: "Test Author" }).expect(400);

      const postsAfter = await helper.postsInDb();
      assert.strictEqual(postsAfter.length, postsBefore.length);
    });

    test(`POST ${endpoint.name} rejects content longer than 300 characters`, async () => {
      const postsBefore = await helper.postsInDb();
      const path =
        typeof endpoint.path === "function"
          ? await endpoint.path()
          : endpoint.path;

      await api
        .post(path)
        .send({ content: "a".repeat(301) })
        .expect(400);

      const postsAfter = await helper.postsInDb();
      assert.strictEqual(postsAfter.length, postsBefore.length);
    });

    test(`POST ${endpoint.name} accepts content with exactly 300 characters`, async () => {
      const postsBefore = await helper.postsInDb();
      const path =
        typeof endpoint.path === "function"
          ? await endpoint.path()
          : endpoint.path;

      await api
        .post(path)
        .send({ content: "a".repeat(300) })
        .expect(201);

      const postsAfter = await helper.postsInDb();
      assert.strictEqual(postsAfter.length, postsBefore.length + 1);
    });

    test(`POST ${endpoint.name} rejects empty content`, async () => {
      const postsBefore = await helper.postsInDb();
      const path =
        typeof endpoint.path === "function"
          ? await endpoint.path()
          : endpoint.path;

      await api.post(path).send({ content: "" }).expect(400);

      const postsAfter = await helper.postsInDb();
      assert.strictEqual(postsAfter.length, postsBefore.length);
    });

    test(`POST ${endpoint.name} accepts a missing author and saves the post`, async () => {
      const postsBefore = await helper.postsInDb();
      const path =
        typeof endpoint.path === "function"
          ? await endpoint.path()
          : endpoint.path;

      const response = await api
        .post(path)
        .send({ content: "Contenido sin autor" })
        .expect(201);

      const postsAfter = await helper.postsInDb();
      assert.strictEqual(postsAfter.length, postsBefore.length + 1);
      const savedPost = await PostModel.findById(response.body.id);
      assert.ok(savedPost);
      assert.strictEqual(savedPost.author, undefined);
    });

    for (const author of [
      "Huevito rey",
      "Matías Toro",
      "Memes es mal ramo",
      "HUEVITO REY",
    ]) {
      test(`POST ${endpoint.name} rejects banned author "${author}"`, async () => {
        const postsBefore = await helper.postsInDb();
        const path =
          typeof endpoint.path === "function"
            ? await endpoint.path()
            : endpoint.path;

        await api
          .post(path)
          .send({ content: "Contenido válido", author })
          .expect(400);

        const postsAfter = await helper.postsInDb();
        assert.strictEqual(postsAfter.length, postsBefore.length);
      });
    }
  }

  test("POST /api/threads/:id con un thread inexistente responde 404 y no crea el comentario", async () => {
    const id = new mongoose.Types.ObjectId();

    const before = await PostModel.countDocuments();

    const response = await request(app).post(`/api/threads/${id}`).send({
      content: "Comentario sin thread",
      author: "Usuario6",
    });

    const after = await PostModel.countDocuments();

    assert.equal(response.status, 404);
    assert.equal(after, before);
  });

  test("POST /api/threads/:id con un parent de otro thread responde 400 y no crea el comentario", async () => {
    const thread1 = await PostModel.create({
      content: "Primer thread",
      author: "Usuario1",
      thread: null,
    });

    const thread2 = await PostModel.create({
      content: "Segundo thread",
      author: "Usuario2",
      thread: null,
    });

    // Crear comentarios para el primer thread
    await PostModel.create({
      content: "Primer comentario",
      author: "Usuario3",
      thread: thread1._id,
    });

    await PostModel.create({
      content: "Segundo comentario",
      author: "Usuario4",
      thread: thread1._id,
    });

    // Crear comentario para el segundo thread
    await PostModel.create({
      content: "Comentario del segundo thread",
      author: "Usuario5",
      thread: thread2._id,
    });

    const thread123 = await PostModel.findOne({
      content: "Primer thread",
      thread: null,
    });

    const thread2Comment = await PostModel.findOne({
      content: "Comentario del segundo thread",
    });

    assert.ok(thread123);
    assert.ok(thread2Comment);

    const before = await PostModel.countDocuments();

    const response = await request(app)
      .post(`/api/threads/${thread123._id}`)
      .send({
        content: "Comentario con parent inválido",
        author: "Usuario6",
        parent: thread2Comment._id,
      });

    const after = await PostModel.countDocuments();

    assert.equal(response.status, 400);
    assert.equal(after, before);
  });

  test("POST /api/threads/:id con un parent del mismo thread responde 201", async () => {
    const thread1 = await PostModel.create({
      content: "Primer thread",
      author: "Usuario1",
      thread: null,
    });

    const thread2 = await PostModel.create({
      content: "Segundo thread",
      author: "Usuario2",
      thread: null,
    });

    // Crear comentarios para el primer thread
    await PostModel.create({
      content: "Primer comentario",
      author: "Usuario3",
      thread: thread1._id,
    });

    await PostModel.create({
      content: "Segundo comentario",
      author: "Usuario4",
      thread: thread1._id,
    });

    // Crear comentario para el segundo thread
    await PostModel.create({
      content: "Comentario del segundo thread",
      author: "Usuario5",
      thread: thread2._id,
    });

    const thread123 = await PostModel.findOne({
      content: "Primer thread",
      thread: null,
    });

    const thread1Comment = await PostModel.findOne({
      content: "Primer comentario",
      thread: thread1?._id,
    });

    assert.ok(thread123);
    assert.ok(thread1Comment);

    const before = await PostModel.countDocuments();

    const response = await request(app)
      .post(`/api/threads/${thread123.id}`)
      .send({
        content: "Respuesta al comentario",
        author: "Usuario6",
        parent: thread1Comment.id,
      });

    const after = await PostModel.countDocuments();

    assert.equal(response.status, 201);
    assert.equal(after, before + 1);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
