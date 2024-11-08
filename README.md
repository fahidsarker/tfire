# tFire

[![npm version](https://img.shields.io/npm/v/tfire?logo=npm&logoColor=fff)](https://www.npmjs.com/package/tfire)
![NPM Downloads](https://img.shields.io/npm/dw/tfire)
![npm bundle size](https://img.shields.io/bundlephobia/min/tfire)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/tfire)
![NPM License](https://img.shields.io/npm/l/tfire)

A Typescript wrapper of the `firebase-admin.firestore` module. It provides a fully type-safe schema-based connector to the firestore database. It is a wrapper around the `firebase-admin.firestore` module.

- **Alpha-release Warning**: This is an alpha release. Please use it with caution. The API might change in the future.
- **Note**:
  - This is a wrapper around the `firebase-admin.firestore` module. Hence, it has all the limitations of the `firebase-admin.firestore` module.
  - It is a `Typescript` wrapper with no validation (`coming soon`). Hence, the types are only ensured if
    you maintain the same schema in other projects using this DB.
    - It was only build to make it easier to ensure types in the **same project**.
    - If you use the firestore db in multiple project, you are responsible to ensure the schema is the same in all projects.
 

# Features

- Fully Type-Safe Schema based connector
  - Instead of calling `db.collection("users").doc('user1').set(...)`, you call `db.users.doc('user1').set(...)`
- `Framework agnostic` - Run anywhere that runs JS
- Not functionally different from `firebase-admin.firestore` module
- `Typesafe` - No more runtime errors due to wrong schema
- Smarter Field Values based on types provided. Example:
  - `{age: number}` can only have `FieldValue.icrement`
  - `{age?: number}` can only have `FieldValue.icrement` and `FieldValue.delete`
- Typesafe insert, update, delete, find operations
- Batch operations
- Simpler query builder coming soon


## Milestones
[x] TSW: Support basic CRUD operations
[x] TSW: Support sub-collections
[x] TSW: Support batch operations
[x] TSW: Support custom types
[x] TSW: Support custom queries
[X] ORM: Simpler Query builders - type-safe simpler queries based on schema. `(eg. db.query.users.findFirst({}))`
[ ] TSW: Support transactions
[ ] ORM: Transformers - transform values as they are inserted or fetched
[ ] TSW: Type-safe collection finder `db.collection("users/u1/posts") => Post[]`
[ ] ORM: Validators - validate values before they are inserted
[ ] ORM: Hooks - run functions before or after insert, update, delete operations
[ ] TSW: Collection Groups

# Usage

Create a global const variable by using the createDB function:

- use the `collection` function to define a collection schema
- use `collection().sub({})` to define a sub-collection schema

### Creating a Database

```ts
// db.ts

import * as admin from "firebase-admin";
import { collection, createDB } from "tfire";

// we will define the following schema:
// |__ users
// |__ posts
//     |__ comments
//         |__ likes

// so we have users, and posts collections,
// and comments and likes sub-collections of posts and comments respectively

export const db = createDB(admin.firestore(), {
  // schema
  users: collection<User>("users"),
  posts: collection<Post>("posts").sub({
    comments: collection<Comment>("comments").sub({
      likes: collection<Like>("likes"),
    }),
  }),
});
```

### Basic Collection Operations

```ts
// get a collection
const usersSnapshot = await db.users.get(); // type: Snapshot<User[]>
const users = usersSnapshot.docs.map((doc) => doc.data()); // type: User[]

// or use the shorthand
const users = await db.users.getData(); // type: User[]

// add a new doc
// type User = {name: string, age: number}
await db.users.add({ name: "user1", age: "wront type" }); // ❌ type error
await db.users.add({ name: "user1", age: 20 }); // ✅ no type error
```

### Basic Document Operations

```ts
// get a doc
const userSnapshot = await db.users.doc("user1").get(); // type: Snapshot<User | undefined>
const user = userSnapshot.data(); // type: User | undefined

// we also provided a shorthand for the above steps
const user = await db.users.doc("user1").getData(); // type: User | undefined

// set or add a new doc
// type User = {name: string, age: number}
await db.users.doc("user1").set({ name: "user1", age: "wront type" }); // ❌ type error
await db.users.doc("user1").set({ name: "user1", age: 20 }); // ✅ no type error

// update a doc
await db.users.doc("user1").update({ name: "user1", age: 20 }); // ✅ no type error
await db.users.doc("user1").update({ name: "user1", age: "wront type" }); // ❌ type error
await db.users
  .doc("user1")
  .update({ name: "user1", age: admin.FieldValue.increment(1) }); // ❌ no type error as FieldValue does not allow typecheck

await db.users
  .doc("user1")
  .update({ name: "user1", age: NumFieldValue.increment(1) }); // ✅ no type error as NumFieldValue is a custom type that only allows increment or decrement

await db.users
  .doc("user1")
  .update({ name: "user1", age: NumFieldValue.decrement(1) }); // ✅ no type error as NumFieldValue is a custom type that only allows increment or decrement

await db.users
  .doc("user1")
  .update({ name: "user1", age: OptionalFieldValue.delete() }); // ❌ no type error as age is not an optional parameter

// delete a doc
await db.users.doc("user1").delete(); // ✅ no type error
```

### Typed-Query

```ts
// get all users with age > 20
const usersSnapshot = await db.users.where("age", ">", "20").get(); // ❌ type error: string can not be compared with number
const usersSnapshot = await db.users.where("age", ">", 20).get(); // ✅ no type error return type: Snapshot<User[]>

// typo in the field name
const usersSnapshot = await db.users.where("agee", ">", 20).get(); // ❌ type error: agee is not a field in User

// select only name field where age > 20
const usersSnapshot = await db.users.where("age", ">", 20).select("nama").get(); // ❌ type error: 'nama' is not a field in User
const usersSnapshot = await db.users.where("age", ">", 20).select("name").get(); // ✅ no type error return type: Snapshot<{name: string}[]>
```

### Batch Operations

```ts
// create a new batch
const batch = db.batch();

// update docs

for (let i = 0; i < 5; i++) {
  batch.set(db.users.doc(`user${i + 1}`), {
    age: 30,
    dob: dob,
    password: "password",
    email: "email",
    name: `User ${i + 1}`,
  });
}

// commit the batch
await batch.commit();
```

### TFQueries
Use TFQueries where possible to simplify queries and data fetching
```ts
const currentUser = await db.query.users.findFirst({where: where("age","==",30)}); // type: User | undefined
const users = await db.query.users.findMany({where: where("age",">",30), limit: 5}); // type: User[] of max length 5

// equal notations are very common in queries. hence, we built in a shorthand for it
const adminsOver30 = await db.query.users.findMany({
  where: {
    age: 30,
    type: "admin",
  }
}); // type: User[]
```
