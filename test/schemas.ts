import { z } from "zod";
import { collection, tFire } from "../src/ts-fire";
import { Timestamp } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

var serviceAccount = require("../secrets/firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const comments = collection("comments", {
  id: z.string(),
  comment: z.string(),
});

const posts = collection(
  "posts",
  {
    id: z.string(),
    name: z.string(),
    age: z.number(),
    email: z.string().optional(),
  },
  { comments }
);

export const users = collection(
  "users",
  {
    id: z.string(),
    name: z.string(),
    age: z.number(),
    email: z.string().optional(),
    password: z.string(),
    dob: z.instanceof(Timestamp),
    createdAt: z.instanceof(Timestamp),
  },
  { comments, posts }
);

const families = collection(
  "families",
  {
    id: z.string(),
    name: z.string(),
  },
  { users }
);

const tests = collection(
  "_tests",
  {
    id: z.string(),
    name: z.string(),
    age: z.number(),
    email: z.string().optional(),
  },
  { families, users }
);

export const db = tFire(admin.firestore(), {
  tests,
});
