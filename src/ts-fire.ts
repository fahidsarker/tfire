import { CollectionPath } from "./collections/collection-path";
import {
  CollectionCreator,
  CollectionCreatorBaseShape,
} from "./collections/collection-creator";
import { DocData, Firestore } from "./types/firestore";
import { CreateDB } from "./types/make-db";
import { newDocId } from "./helper";
import { TFireBatch } from "./batch";

export const collection = <T extends DocData, X extends string = string>(
  collectionName: X
) => {
  return new CollectionCreator<X, T, {}>(
    {} as Firestore,
    collectionName,
    {},
    // `${collectionName}`
    CollectionPath.createRoot(collectionName)
  );
};

export const createDB = <T extends CollectionCreatorBaseShape>(
  db: Firestore,
  schema: T
) => {
  const nDB = {} as any;
  Object.keys(schema).forEach((key) => {
    nDB[key] = (schema as unknown as T)[key].copy(
      db,
      (schema as unknown as T)[key].pathPlaceHolder,
      undefined
    );
  });

  const xDB = nDB as CreateDB<T>;
  return {
    newDocId: () => newDocId(db, ""),
    batch: () => new TFireBatch(db.batch()),
    // col: <C extends keyof T>(collectionName: C): CreateDB<T>[C] =>
    // xDB[collectionName],
    ...xDB,
  };
};
