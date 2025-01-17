// const h = db.doc("users/asd/posts/pid");

import { db } from "./schemas";

describe("Collection/Doc Path matching", () => {
  it("should match /users", async () => {
    const users = db.collection("users");
    expect(users.path).toBe("users");
  });
  it("should match /users/uid", async () => {
    const users = db.collection("users");
    const user = users.doc("uid");
    expect(user.path).toBe("users/uid");
  });
  it("should match /users/uid/posts", async () => {
    const users = db.collection("users");
    const user = users.doc("uid");
    expect(user.path).toBe("users/uid");
    const posts = user.nPosts;
    expect(posts.path).toBe("users/uid/posts");
  });

  it("should match /users/uid/posts/pid", async () => {
    const users = db.collection("users");
    const user = users.doc("uid");
    expect(user.path).toBe("users/uid");
    const posts = user.nPosts;
    expect(posts.path).toBe("users/uid/posts");
    const post = posts.doc("pid");
    expect(post.path).toBe("users/uid/posts/pid");
  });

  it("should match /users/uid/posts/pid", async () => {
    const users = db.collection("users");
    const user = users.doc("uid");
    const posts = user.collection("posts");
    const post = posts.doc("pid");
    expect(post.path).toBe("users/uid/posts/pid");
  });

  it("should match /users/uid/posts/pid and more", async () => {
    const post = db.doc("users/uid/posts/pid");
    expect(post.path).toBe("users/uid/posts/pid");
    const comments = post.collection("comments");
    expect(comments.path).toBe("users/uid/posts/pid/comments");
    const comment = comments.doc("cmd");
    expect(comment.path).toBe("users/uid/posts/pid/comments/cmd");
  });

  it("should match /users/uid/posts/pid/comments/cmd", async () => {
    const comments = db.doc("users/uid/posts/pid/comments/cmd");
    expect(comments.path).toBe("users/uid/posts/pid/comments/cmd");
  });
});
