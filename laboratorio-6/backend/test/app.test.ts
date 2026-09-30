import { describe, test, beforeEach, after } from 'node:test';
import mongoose from 'mongoose';
import assert from 'node:assert';
import PostModel from '../src/models/posts';
import supertest from 'supertest';
import app from '../src/app';
import helper from './test_helper';

const api = supertest(app);

describe('Integration tests for the API endpoints', () => {

    // P2

    beforeEach(async () => {
        await PostModel.deleteMany({});
        console.log('Cleared the database before each test');
        await PostModel.insertMany(helper.initialPosts);
        console.log('Inserted initial posts before each test');
    });

    test('GET /api/threads returns all threads', async () => {
        const response = await api.get('/api/threads')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const threadsInDb = await helper.postsInDb();
        assert.strictEqual(response.body.length, threadsInDb.filter((post) => post.thread === null).length);
    });

    test('GET /api/threads/:id returns a specific thread with its comments', async () => {
        const threadsInDb = await helper.postsInDb();
        const threadId = threadsInDb[0].id;

        const response = await api.get(`/api/threads/${threadId}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.thread.id, threadId);
    });

    // P3

    test('responses use id and do not include _id or __v', async () => {
        const threadsResponse = await api.get('/api/threads')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        threadsResponse.body.forEach((thread: Record<string, unknown>) => {
            assert.ok(thread.id);
            assert.strictEqual(thread._id, undefined);
            assert.strictEqual(thread.__v, undefined);
        });

        const threadId = threadsResponse.body[0].id;
        const threadResponse = await api.get(`/api/threads/${threadId}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.ok(threadResponse.body.thread.id);
        assert.strictEqual(threadResponse.body.thread._id, undefined);
        assert.strictEqual(threadResponse.body.thread.__v, undefined);
        threadResponse.body.comments.forEach((comment: Record<string, unknown>) => {
            assert.ok(comment.id);
            assert.strictEqual(comment._id, undefined);
            assert.strictEqual(comment.__v, undefined);
        });
    });

    test('GET /api/threads/:id returns 404 for a valid id that does not exist', async () => {
        await api.get(`/api/threads/${new mongoose.Types.ObjectId()}`)
            .expect(404);
    });

    test('GET /api/threads/:id returns 400 for a malformed id', async () => {
        await api.get('/api/threads/not-an-id')
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'malformatted id' });
    });

    test('unknown routes return 404 with a JSON error', async () => {
        await api.get('/api/does-not-exist')
            .expect(404)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'unknown endpoint' });
    });

    // P4

    const creationEndpoints = [
        {
            name: 'thread',
            path: '/api/threads',
        },
        {
            name: 'comment',
            path: async () => {
                const postsInDb = await helper.postsInDb();
                return `/api/threads/${postsInDb[0].id}`;
            },
        },
    ];

    for (const endpoint of creationEndpoints) {
        test(`POST ${endpoint.name} with valid content creates exactly one post`, async () => {
            const postsBefore = await helper.postsInDb();
            const path = typeof endpoint.path === 'function'
                ? await endpoint.path()
                : endpoint.path;

            const response = await api.post(path)
                .send({ content: 'Contenido válido', author: 'Test Author' })
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const postsAfter = await helper.postsInDb();
            assert.strictEqual(postsAfter.length, postsBefore.length + 1);
            assert.strictEqual(response.body.content, 'Contenido válido');
        });

        test(`POST ${endpoint.name} without content returns 400 and does not create a post`, async () => {
            const postsBefore = await helper.postsInDb();
            const path = typeof endpoint.path === 'function'
                ? await endpoint.path()
                : endpoint.path;

            await api.post(path)
                .send({ author: 'Test Author' })
                .expect(400);

            const postsAfter = await helper.postsInDb();
            assert.strictEqual(postsAfter.length, postsBefore.length);
        });

        test(`POST ${endpoint.name} rejects content longer than 300 characters`, async () => {
            const postsBefore = await helper.postsInDb();
            const path = typeof endpoint.path === 'function'
                ? await endpoint.path()
                : endpoint.path;

            await api.post(path)
                .send({ content: 'a'.repeat(301) })
                .expect(400);

            const postsAfter = await helper.postsInDb();
            assert.strictEqual(postsAfter.length, postsBefore.length);
        });

        test(`POST ${endpoint.name} accepts content with exactly 300 characters`, async () => {
            const postsBefore = await helper.postsInDb();
            const path = typeof endpoint.path === 'function'
                ? await endpoint.path()
                : endpoint.path;

            await api.post(path)
                .send({ content: 'a'.repeat(300) })
                .expect(201);

            const postsAfter = await helper.postsInDb();
            assert.strictEqual(postsAfter.length, postsBefore.length + 1);
        });

        test(`POST ${endpoint.name} rejects empty content`, async () => {
            const postsBefore = await helper.postsInDb();
            const path = typeof endpoint.path === 'function'
                ? await endpoint.path()
                : endpoint.path;

            await api.post(path)
                .send({ content: '' })
                .expect(400);

            const postsAfter = await helper.postsInDb();
            assert.strictEqual(postsAfter.length, postsBefore.length);
        });

        test(`POST ${endpoint.name} accepts a missing author and saves the post`, async () => {
            const postsBefore = await helper.postsInDb();
            const path = typeof endpoint.path === 'function'
                ? await endpoint.path()
                : endpoint.path;

            const response = await api.post(path)
                .send({ content: 'Contenido sin autor' })
                .expect(201);

            const postsAfter = await helper.postsInDb();
            assert.strictEqual(postsAfter.length, postsBefore.length + 1);
            const savedPost = await PostModel.findById(response.body.id);
            assert.ok(savedPost);
            assert.strictEqual(savedPost.author, undefined);
        });

        for (const author of ['Huevito rey', 'Matías Toro', 'Memes es mal ramo', 'HUEVITO REY']) {
            test(`POST ${endpoint.name} rejects banned author "${author}"`, async () => {
                const postsBefore = await helper.postsInDb();
                const path = typeof endpoint.path === 'function'
                    ? await endpoint.path()
                    : endpoint.path;

                await api.post(path)
                    .send({ content: 'Contenido válido', author })
                    .expect(400);

                const postsAfter = await helper.postsInDb();
                assert.strictEqual(postsAfter.length, postsBefore.length);
            });
        }
    }

    // P5

    test('POST /api/threads/:id returns 404 for a missing thread and does not create a comment', async () => {
        const postsBefore = await helper.postsInDb();
        const missingThreadId = new mongoose.Types.ObjectId().toString();

        await api.post(`/api/threads/${missingThreadId}`)
            .send({ content: 'Comentario sin thread' })
            .expect(404);

        const postsAfter = await helper.postsInDb();
        assert.strictEqual(postsAfter.length, postsBefore.length);
    });

    test('POST /api/threads/:id rejects a parent from another thread', async () => {
        const postsInDb = await helper.postsInDb();

        const threads = postsInDb.filter((post) => post.thread === null);
        const comments = postsInDb.filter((post) => post.thread !== null);

        const firstThread = threads[0];
        const secondThreadComment = comments.find(
            (comment) => comment.thread?.toString() !== firstThread.id
        );
        const postsBefore = await helper.postsInDb();

        await api.post(`/api/threads/${firstThread.id}`)
            .send({ content: 'Comentario inválido', parent: secondThreadComment!.id })
            .expect(400);

        const postsAfter = await helper.postsInDb();
        assert.strictEqual(postsAfter.length, postsBefore.length);
    });

    test('POST /api/threads/:id accepts a parent from the same thread', async () => {
        const postsInDb = await helper.postsInDb();
        const thread = postsInDb.find((post) => post.thread === null);
        const parent = postsInDb.find(
            (post) => post.thread?.toString() === thread.id
        );
        const postsBefore = await helper.postsInDb();

        await api.post(`/api/threads/${thread.id}`)
            .send({ content: 'Respuesta al comentario', parent: parent.id })
            .expect(201);

        const postsAfter = await helper.postsInDb();
        assert.strictEqual(postsAfter.length, postsBefore.length + 1);
    });

    // P6

    test('PUT /api/posts/:id updates a post and persists the change', async () => {
        const post = (await helper.postsInDb())[0];
        const updatedLikes = post.likes + 1;

        await api.put(`/api/posts/${post.id}`)
            .send({ likes: updatedLikes })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const savedPost = await PostModel.findById(post.id);
        assert.ok(savedPost);
        assert.strictEqual(savedPost.likes, updatedLikes);
    });

    test('PUT /api/posts/:id returns 404 for a missing post', async () => {
        const missingPostId = new mongoose.Types.ObjectId().toString();

        await api.put(`/api/posts/${missingPostId}`)
            .send({ likes: 1 })
            .expect(404);
    });

    test('PUT /api/posts/:id rejects content longer than 300 characters without modifying the post', async () => {
        const post = (await helper.postsInDb())[0];
        const originalContent = post.content;

        await api.put(`/api/posts/${post.id}`)
            .send({ content: 'a'.repeat(301) })
            .expect(400);

        const savedPost = await PostModel.findById(post.id);
        assert.ok(savedPost);
        assert.strictEqual(savedPost.content, originalContent);
    });

    test('PUT /api/posts/:id rejects empty content without modifying the post', async () => {
        const post = (await helper.postsInDb())[0];
        const originalContent = post.content;

        await api.put(`/api/posts/${post.id}`)
            .send({ content: '' })
            .expect(400);

        const savedPost = await PostModel.findById(post.id);
        assert.ok(savedPost);
        assert.strictEqual(savedPost.content, originalContent);
    });

    test('PUT /api/posts/:id rejects a banned author without modifying the post', async () => {
        const post = (await helper.postsInDb())[0];
        const originalAuthor = post.author;

        await api.put(`/api/posts/${post.id}`)
            .send({ author: 'HUEVITO REY' })
            .expect(400);

        const savedPost = await PostModel.findById(post.id);
        assert.ok(savedPost);
        assert.strictEqual(savedPost.author, originalAuthor);
    });

    after(async () => {
        await mongoose.connection.close();
    });

});