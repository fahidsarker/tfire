import { createDB, collection } from "../src/ts-fire";
import dotenv from "dotenv";
import * as admin from "firebase-admin";
import { Family, User } from "./models";
import { Timestamp } from "firebase-admin/firestore";
import { OptionalFieldValue, NumFieldValue } from "../src/types/field-values";
dotenv.config();
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  // serviceAccountId: "test",
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

const db = createDB(admin.firestore(), {
  users: collection<User>("_internal_test_area/tests/batchusers").sub({
    families: collection<Family>("families"),
  }),
});

describe("Batch Run test", () => {
  const dob = Timestamp.now();
  beforeAll(async () => {
    const batch = db.batch();
    for (let i = 0; i < 5; i++) {
      batch.set(db.users.doc(`user${i + 1}`), {
        age: 30,
        dob: dob,
        password: "password",
        email: "email",
        name: `User ${i + 1}`,
      });
    }
    await batch.commit();
  });

  it("Should get all 5 users", async () => {
    const users = await db.users.get();
    expect(users.docs.length).toBe(5);
  });

  it("should update all 5 users", async () => {
    const batch = db.batch();
    for (let i = 0; i < 5; i++) {
      batch.update(db.users.doc(`user${i + 1}`), {
        age: 1000,
      });
    }
    await batch.commit();
  });

  it("should validate all 5 users have age 1000", async () => {
    const users = await db.users.get();
    users.docs.forEach((doc) => {
      expect(doc.data().age).toBe(1000);
    });
  });

  afterAll(async () => {
    const batch = db.batch();
    for (let i = 0; i < 5; i++) {
      batch.delete(db.users.doc(`user${i + 1}`));
    }
    await batch.commit();
  });
});
