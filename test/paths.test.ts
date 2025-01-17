// const h = db.doc("users/asd/posts/pid");

import { db } from "./schemas";

describe("Collection/Doc Path matching", () => {
  it("should match /_tests", async () => {
    const tests = db.collection("_tests");
    expect(tests.path).toBe("_tests");
  });

  it("should match /_tests/users", async () => {
    const users = db.collection("_tests/tit/users");
    expect(users.path).toBe("_tests/tit/users");
    const user = users.doc("uid");
    expect(user.path).toBe("_tests/tit/users/uid");
    const docUser = db.doc("_tests/tit/users/uid");
    expect(docUser.path).toBe("_tests/tit/users/uid");
    expect(docUser.id).toBe("uid");
  });

  it("should match /_tests/users/uid/posts", async () => {
    const posts = db.collection("_tests/tit/users/uid/posts");
    expect(posts.path).toBe("_tests/tit/users/uid/posts");
    const post = posts.doc("pid");
    expect(post.path).toBe("_tests/tit/users/uid/posts/pid");
  });

  it("should match /_tests/users/uid/posts/pid", async () => {
    const post = db.doc("_tests/tit/users/uid/posts/pid");
    expect(post.path).toBe("_tests/tit/users/uid/posts/pid");
    const comments = post.collection("comments");
    expect(comments.path).toBe("_tests/tit/users/uid/posts/pid/comments");
    const comment = comments.doc("cmd1");
    expect(comment.path).toBe("_tests/tit/users/uid/posts/pid/comments/cmd1");
    const docComment = db.doc("_tests/tit/users/uid/posts/pid/comments/cmd1");
    expect(docComment.path).toBe(
      "_tests/tit/users/uid/posts/pid/comments/cmd1"
    );
    expect(docComment.id).toBe("cmd1");
  });
});
