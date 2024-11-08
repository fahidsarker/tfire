import { createDB, collection } from "../src/ts-fire";
import dotenv from "dotenv";
import * as admin from "firebase-admin";
import { Family, Toy, User } from "./models";

dotenv.config();
admin.initializeApp({
  projectId: "test",
  // serviceAccountId: "test",
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

const db = createDB(admin.firestore(), {
  families: collection<Family>("families").sub({
    users: collection<User>("users"),
    otherFamily: collection<Family>("otherFamilies"),
    toys: collection<Toy>("toys").sub({
      toyUsers: collection<User>("toyUsers"),
      recommendedations: collection<Toy>("recommendedations").sub({
        relatedUsers: collection<User>("relatedUsers").sub({
          children: collection<User>("children"),
        }),
      }),
    }),
  }),
  users: collection<User>("another-top-users"),
});
describe("Path Creation tests", () => {
  it("should match simple paths", () => {
    expect(db.families.doc("xfamily1").toys.path).toBe(
      "families/xfamily1/toys",
    );
    expect(db.families.doc("newFamilyId").path).toBe("families/newFamilyId");
    expect(
      db.families.doc("nfamilies").otherFamily.doc("nfamiliesy").path,
    ).toBe("families/nfamilies/otherFamilies/nfamiliesy");

    expect(
      db.families
        .doc("f1")
        .toys.doc("t1")
        .recommendedations.doc("r1")
        .relatedUsers.doc("u1")
        .children.doc("c1").path,
    ).toBe(
      "families/f1/toys/t1/recommendedations/r1/relatedUsers/u1/children/c1",
    );
  });
});
