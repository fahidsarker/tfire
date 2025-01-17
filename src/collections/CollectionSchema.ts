import { z, ZodObject, ZodRawShape } from "zod";
import { CollectionSchemas } from "../types/collections";
import { TCollection } from "./tCollection";
import { Firestore } from "../types/firestore";
import { BaseDBSchema } from "../types/doc_data";

export class CollectionSchema<
  N extends string,
  D extends BaseDBSchema,
  SubCollections extends CollectionSchemas,
> {
  name: N;
  schema: D;
  subCollections: SubCollections;

  constructor(name: N, schema: D, subCollections: SubCollections) {
    this.name = name;
    this.schema = schema;
    this.subCollections = subCollections;
  }

  build(db: Firestore, parentPath: string): TCollection<N, D, SubCollections> {
    return new TCollection<N, D, SubCollections>(
      this.name,
      this.schema,
      this.subCollections,
      parentPath,
      db
    );
  }
}

// function collection<
//   N extends string,
//   D extends ZodObject<ZodRawShape>,
//   SubCollections extends CollectionSchemas,
// >(name: N, schema: D, subCollections: SubCollections) {
//   return new CollectionSchema(name, schema, subCollections);
// }

// const families = collection(
//   "families",
//   z.object({
//     name: z.string(),
//   }),
//   {}
// );

// const comments = collection(
//   "comments",
//   z.object({
//     comment: z.string(),
//     name: z.string(),
//     age: z.number(),
//     email: z.string().optional(),
//     password: z.string(),
//     dob: z.date(),
//   }),
//   { families }
// );

// const posts = collection(
//   "posts",
//   z.object({
//     post: z.string(),
//     name: z.string(),
//     age: z.number(),
//     email: z.string().optional(),
//     password: z.string(),
//     dob: z.date(),
//   }),
//   { comments }
// );

// const users = collection(
//   "users",
//   z.object({
//     name: z.string(),
//     age: z.number(),
//     email: z.string().optional(),
//     password: z.string(),
//     dob: z.date(),
//   }),
//   { comments: comments, posts: posts }
// );

// const x = users.subCollections.posts;

// class DB<Cols extends CollectionSchemas> {
//   readonly collections: Cols;
//   constructor(collections: Cols) {
//     this.collections = collections;
//   }

//   collection<K extends string>(
//     key: ValidCollectionPath<typeof this.collections, K>
//   ): FindCollection<typeof this.collections, K> {
//     for (const [k, v] of Object.entries(this.collections)) {
//       if (v.name === key) {
//         return v as FindCollection<typeof this.collections, K>;
//       }
//     }

//     throw new Error(`Collection ${key} not found`);
//   }

//   doc<K extends string>(
//     key: ValidDocPath<typeof this.collections, K>
//   ): FindDocType<typeof this.collections, K> {
//     for (const [k, v] of Object.entries(this.collections)) {
//       if (v.name === key) {
//         return v as FindDocType<typeof this.collections, K>;
//       }
//     }

//     throw new Error(`Collection ${key} not found`);
//   }
// }

// const db = new DB({
//   users,
//   posts,
//   comments,
//   families,
// });

// const x = db.collections.users.doc().posts.doc("").get();
// const y = db.collection("users/uid/posts/pid/comments");
// const yd = db.doc("users/uid/posts/pid");

// type X = FindDocType<typeof db.collections, `users/uid/posts/as`>;
