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
  users: collection<User>("_internal_test_area/tests/users").sub({
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

describe("Read Write tests", () => {
  it("should write and then read to a document", async () => {
    const dob = Timestamp.now();
    const name = generateRandomString(10);
    const email = generateRandomString(10) + "@gmail.com";
    const password = generateRandomString(10);
    await db.users.doc("user1").set({
      name,
      age: 23,
      email: email,
      password: password,
      dob,
    });

    const readData = await db.users.doc("user1").get();

    const readDataData = readData.data();

    expect(readDataData).not.toBe(null);
    expect(readDataData?.name).toBe(name);
    expect(readDataData?.age).toBe(23);
    expect(readDataData?.email).toBe(email);
    expect(readDataData?.password).toBe(password);
    expect(readDataData?.dob.nanoseconds).toBe(dob.nanoseconds);

    await db.users.doc("user1").update({
      age: NumFieldValue.increment(1),
      email: OptionalFieldValue.delete(),
    });

    const readDataAfterUpdate = await db.users.doc("user1").get();
    const readDataDataAfterUpdate = readDataAfterUpdate.data();

    expect(readDataDataAfterUpdate).not.toBe(null);
    expect(readDataDataAfterUpdate?.name).toBe(name);
    expect(readDataDataAfterUpdate?.age).toBe(24);
    expect(readDataDataAfterUpdate?.email).toBe(undefined);
    expect(readDataDataAfterUpdate?.password).toBe(password);

    await db.users.doc("user1").delete();

    const readDataAfterDelete = await db.users.doc("user1").get();
    const readDataDataAfterDelete = readDataAfterDelete.data();

    expect(readDataDataAfterDelete).toBe(undefined);
  });
});
