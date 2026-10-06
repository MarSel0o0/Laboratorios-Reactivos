import { describe, test } from "node:test";
import assert from "node:assert";
import { Post } from "../../src/models/posts";

import { filterPostsByWord } from "../../src/utils/post_utils";
import { initialPosts } from "./data";

describe("filterPostsByWord", () => {
  test("filter of palabra", () => {
    const result: Post[] = filterPostsByWord(initialPosts, "palabra");

    assert.strictEqual(3, result.length);
  });

  test("filter of Palabra", () => {
    const result: Post[] = filterPostsByWord(initialPosts, "Palabra");

    assert.strictEqual(3, result.length);
  });

  test("filter of PALABRA", () => {
    const result: Post[] = filterPostsByWord(initialPosts, "PALABRA");

    assert.strictEqual(3, result.length);
  });

  test("filter of palabra con puntuacion ", () => {
    const result: Post[] = filterPostsByWord(initialPosts, "palabra.");

    assert.strictEqual(3, result.length);
  });

  test("filter of palabr", () => {
    const result: Post[] = filterPostsByWord(initialPosts, "palabr");

    assert.strictEqual(0, result.length);
  });

  test("filter of Posts vacio", () => {
    const result: Post[] = filterPostsByWord([], "palabra");

    assert.strictEqual(0, result.length);
  });

  test("filter of string vacio", () => {
    const result: Post[] = filterPostsByWord(initialPosts, "");

    assert.strictEqual(0, result.length);
  });

  test("filter of string no contenido en ningun post", () => {
    const result: Post[] = filterPostsByWord(
      initialPosts,
      "string no contenido en ningun post",
    );

    assert.strictEqual(0, result.length);
  });
});
