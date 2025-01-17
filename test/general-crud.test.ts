import { Timestamp, WriteResult } from "firebase-admin/firestore";
import { db, users } from "./schemas";
import { z } from "zod";

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
      await user.set(invalidUserData as z.infer<(typeof users)["schema"]>);
    }).rejects.toThrow();
  });

  it("should silently fail to set some user data", async () => {
    const user = db.doc("_tests/t1/users/u3");
    expect(user.path).toBe("_tests/t1/users/u3");
    const res = await user.safeSet(
      invalidUserData as z.infer<(typeof users)["schema"]>
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
});
