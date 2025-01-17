import { z } from "zod";
import { collection, tFire } from "../src/ts-fire";
import { Timestamp } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
admin.initializeApp({
  projectId: "test",
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

class Child {}

const xComments = collection("comments", {
  id: z.string(),
  comment: z.string(),
  name: z.string(),
  age: z.number(),
  email: z.string().optional(),
});

const nPosts = collection(
  "posts",
  {
    id: z.string(),
    post: z.string(),
    description: z.string(),
    name: z.string(),
    publishDate: z.instanceof(Timestamp),
    age: z.number(),
    email: z.string().optional(),
  },
  { xComments }
);

const nUsers = collection(
  "users",
  {
    id: z.string(),
    name: z.string(),
    age: z.number(),
    email: z.string().optional(),
    password: z.string(),
    dob: z.date(),
    child: z.instanceof(Child),
  },
  { nPosts }
);

const families = collection("families", {
  id: z.string(),
  name: z.string(),
});

export const db = tFire(admin.firestore(), {
  nUsers,
  nPosts,
  xComments,
  families,
});
