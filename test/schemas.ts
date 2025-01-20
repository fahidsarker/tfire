import { collection, tFire } from "../src/ts-fire";
import * as admin from "firebase-admin";
import dotenv from "dotenv";

import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { number, string, timestamp } from "../src/schema/elements";
dotenv.config();

var serviceAccount = require("../secrets/firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const comments = collection("comments", {
  id: string(),
  comment: string(),
});

const posts = collection(
  "posts",
  {
    id: string(),
    name: string().nullable(),
    age: number(),
    email: string().nullable(),
  },
  { comments }
);

export const users = collection(
  "users",
  {
    id: string(),
    name: string(),
    age: number(),
    email: string().nullable(),
    password: string(),
    dob: timestamp(),
    createdAt: timestamp(),
  },
  { comments, posts }
);

const families = collection(
  "families",
  {
    id: string(),
    name: string(),
  },
  { users }
);

const tests = collection(
  "_tests",
  {
    id: string(),
    name: string(),
    age: number(),
    email: string().nullable(),
  },
  { families, users }
);

export const db = tFire(admin.firestore(), {
  tests,
});
