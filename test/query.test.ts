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
  users: collection<User>("_internal_test_area/tests/xusers").sub({
    families: collection<Family>("families"),
  }),
});

const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

describe("Query tests", () => {
  const dob = Timestamp.now();
  beforeAll(async () => {
    for (let i = 0; i < 5; i++) {
      await db.users.doc(`user${i + 1}`).set({
        name: `User ${i + 1}`,
        age: i % 2 === 0 ? 10 : 20,
        dob: dob,
        password: i % 2 === 0 ? "password" : "password2",
        email: i % 2 === 0 ? "email" : "email2",
      });
    }
  });

  it("query all 5 docs using dob", async () => {
    const users = await db.users.where("dob", "==", dob).get();
    expect(users.docs.length).toBe(5);
  });

  it("should query all 3 docs with age 10", async () => {
    const users = await db.users.where("age", "==", 10).get();
    expect(users.docs.length).toBe(3);
  });

  it("should query all 2 docs with age 20", async () => {
    const users = await db.users.where("age", "==", 20).get();
    expect(users.docs.length).toBe(2);
  });

  it("should query all 2 docs with password 'password'", async () => {
    const users = await db.users.where("password", "==", "password").get();
    expect(users.docs.length).toBe(3);
  });

  it("should query all 3 docs with email 'email'", async () => {
    const users = await db.users.where("email", "==", "email").get();
    expect(users.docs.length).toBe(3);
  });

  it("should only contain selected types", async () => {
    const dta = (
      await db.users.where("age", "==", 10).select("name", "password").get()
    ).docs.map((doc) => doc.data());

    // age is a type error
    expect((dta[0] as any).age).toBeUndefined();
    expect(dta[0].name).toBeTruthy();
    expect(dta[0].password).toBeTruthy();
  });

  afterAll(async () => {
    for (let i = 0; i < 5; i++) {
      await db.users.doc(`user${i + 1}`).delete();
    }
  });
});
