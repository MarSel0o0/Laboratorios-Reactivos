import { describe, test, beforeEach } from "node:test";
import assert from "node:assert";
import { initialPosts } from "./data";

import { filterPostsByWord } from "../../src/utils/post_utils";

describe("filter", () => {
  test("Filtering is case-insensitive", () => {
    const result = filterPostsByWord(initialPosts, "TEST");
    assert.strictEqual(result.length, 2);
  });

  test("Filtering ignores punctuation", () => {
    const result = filterPostsByWord(initialPosts, "2");
    assert.strictEqual(result.length, 1);
  });

  test("Filtering works only with full words", () => {
    const result = filterPostsByWord(initialPosts, "Tes");
    assert.strictEqual(result.length, 0);
  });

  test("Empty query returns empty array", () => {
    const result = filterPostsByWord(initialPosts, "");
    assert.strictEqual(result.length, 0);
  });

  test("Empty posts returns empty array", () => {
    const result = filterPostsByWord([], "Test");
    assert.strictEqual(result.length, 0);
  });

  test("Filtering with no results returns empty array", () => {
    const result = filterPostsByWord(initialPosts, "Nonexistent");
    assert.strictEqual(result.length, 0);
  });
});
