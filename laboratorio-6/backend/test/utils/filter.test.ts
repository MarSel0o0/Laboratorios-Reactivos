import { describe, test, beforeEach, after } from 'node:test';
import mongoose from 'mongoose';
import assert from 'node:assert';
import PostModel, { Post } from '../../src/models/posts';
import filterPostByWord from '../../src/utils/filter';
import helper from '../test_helper';

describe('filterPostByWord', async () => {

    beforeEach(async () => {
        await PostModel.deleteMany({});
        console.log('Cleared the database before each test');
        await PostModel.insertMany(helper.initialPosts);
        console.log('Inserted initial posts before each test');
    });

    test('the filter should be case insensitive', async () => {
        const posts = await helper.postsInDb();
        const filteredPosts: Post[] = filterPostByWord(posts, 'PALABRA');

        filteredPosts.forEach((post: Post) => {
            assert(post.content.toLowerCase().includes('palabra'));
        });
    });

    test('the filter should ignore punctuation rules', async () => {
        const posts = await helper.postsInDb();
        const filteredPostsComma: Post[] = filterPostByWord(posts, 'palabra,');
        const filteredPostsPeriod: Post[] = filterPostByWord(posts, 'palabra.');
        const filteredPostsExclamation: Post[] = filterPostByWord(posts, 'palabra!');
        const filteredPostsQuestion: Post[] = filterPostByWord(posts, 'palabra?');
        const filteredPostsSemicolon: Post[] = filterPostByWord(posts, 'palabra;');
        const filteredPostsColon: Post[] = filterPostByWord(posts, 'palabra:');
        const filteredPostsQuote: Post[] = filterPostByWord(posts, 'palabra"');
        const filteredPostsApostrophe: Post[] = filterPostByWord(posts, "palabra'");

        const filteredPosts = [
            ...filteredPostsComma,
            ...filteredPostsPeriod,
            ...filteredPostsExclamation,
            ...filteredPostsQuestion,
            ...filteredPostsSemicolon,
            ...filteredPostsColon,
            ...filteredPostsQuote,
            ...filteredPostsApostrophe
        ];

        filteredPosts.forEach((post: Post) => {
            assert(post.content.toLowerCase().includes('palabra'));
        });
    });

    test('the filter should only match whole words', async () => {
        const posts = await helper.postsInDb();
        const filteredPosts: Post[] = filterPostByWord(posts, 'pala');
        
        filteredPosts.forEach((post: Post) => {
            assert(!post.content.toLowerCase().includes('palabra'));
        });
    });

    test('if posts is empty, query is the empty string or none of the posts contain the query, the filter should return an empty array', async () => {
        const posts = await helper.postsInDb();
        const filteredPostsEmpty: Post[] = filterPostByWord([], 'palabra');
        const filteredPostsEmptyQuery: Post[] = filterPostByWord(posts, '');
        const filteredPostsNoMatch: Post[] = filterPostByWord(posts, 'nonexistentword');

        assert.strictEqual(filteredPostsEmpty.length, 0);
        assert.strictEqual(filteredPostsEmptyQuery.length, 0);
        assert.strictEqual(filteredPostsNoMatch.length, 0);
    });

    after(async () => {
        await mongoose.connection.close();
    });

});