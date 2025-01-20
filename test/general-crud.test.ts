import { FieldValue, Timestamp, WriteResult } from "firebase-admin/firestore";
import { db, users } from "./schemas";
import { z } from "zod";
import { NumFieldValue, OptionalFieldValue } from "../src/types/field-values";

const userData = {
  name: "user1",
  age: 20,
  email: "email",
  password: "password",
  dob: Timestamp.fromDate(new Date("2022-01-01")),
  createdAt: Timestamp.fromDate(new Date("2022-01-01")),
  id: "u1",
};

const { email, password, ...invalidUserData } = userData;

describe("Setting some test data", () => {
  it("should set some user data", async () => {
    const user = db.doc("_tests/t1/users/u1");
    expect(user.path).toBe("_tests/t1/users/u1");
    await user.set(userData);
    expect(user.id).toBe("u1");
  });

  it("should fail to set some user data", async () => {
    const user = db.doc("_tests/t1/users/u2");
    expect(user.path).toBe("_tests/t1/users/u2");
    await expect(async () => {
      await user.set(invalidUserData as z.input<(typeof users)["schema"]>);
    }).rejects.toThrow();
  });

  it("should silently fail to set some user data", async () => {
    const user = db.doc("_tests/t1/users/u3");
    expect(user.path).toBe("_tests/t1/users/u3");
    const res = await user.safeSet(
      invalidUserData as z.input<(typeof users)["schema"]>
    );
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });
});

describe("Getting some test data", () => {
  it("should get some user data", async () => {
    const user = db.doc("_tests/t1/users/u1");
    expect(user.path).toBe("_tests/t1/users/u1");
    const snap = await user.get();
    expect(snap.data()).toEqual(userData);
  });

  it("should fail to get some user data", async () => {
    const user = db.doc("_tests/t1/users/invalid");
    expect(user.path).toBe("_tests/t1/users/invalid");
    await expect(async () => {
      return await user.get();
    }).rejects.toThrow();
  });

  it("should silently fail to get some user data", async () => {
    const user = db.doc("_tests/t1/users/invalid");
    expect(user.path).toBe("_tests/t1/users/invalid");
    const res = await user.safeGet();
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });
});

describe("Deleting some test data", () => {
  it("should create some data for deletion and delete it", async () => {
    const user = db.doc("_tests/t1/users/u4");
    expect(user.path).toBe("_tests/t1/users/u4");
    await user.set(userData);
    expect(user.id).toBe("u4");

    return await user.delete();
  });

  describe("Updating some test data", () => {
    const baseUserData = userData;

    beforeAll(async () => {
      const user = db.doc("_tests/t1/users/u4");
      expect(user.path).toBe("_tests/t1/users/u4");
      await user.set(userData);
      expect(user.id).toBe("u4");

      const post = db.doc("_tests/t1/users/u4/posts/p1");
      expect(post.path).toBe("_tests/t1/users/u4/posts/p1");
      await post.set({
        id: "p1",
        name: "post1",
        email: "email",
        age: 20,
      });
    });

    it("should update some user data", async () => {
      const user = db.doc("_tests/t1/users/u4");
      expect(user.path).toBe("_tests/t1/users/u4");
      await user.update({
        name: "user5",
        id: "u4",
        // age: NumFieldValue.increment(5),
        age: 25,
      });
      const nUser = await user.get();
      expect(nUser.data()).toEqual({
        ...baseUserData,
        name: "user5",
        age: 25,
        id: "u4",
      });
    });

    it("should update some post data", async () => {
      const post = db.doc("_tests/t1/users/u4/posts/p1");
      expect(post.path).toBe("_tests/t1/users/u4/posts/p1");
      await post.update({
        name: "post5",
        id: "p1",
        email: null,
      });
      const nPost = await post.get();
      expect(nPost.data()?.email).toBeNull();
    });

    afterAll(async () => {
      const user = db.doc("_tests/t1/users/u4");
      expect(user.path).toBe("_tests/t1/users/u4");
      await user.delete();

      const post = db.doc("_tests/t1/users/u4/posts/p1");
      expect(post.path).toBe("_tests/t1/users/u4/posts/p1");
      await post.delete();
    });
  });
});
