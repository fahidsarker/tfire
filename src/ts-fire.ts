import { z } from "zod";
import {
  CollectionSchemas,
  FindCollectionFromPath,
  FindDocTypeFromPath,
  SchemasToCollections,
  TrueCollectionSchemas,
  ValidCollectionPath,
  ValidDocPath,
} from "./types/collections";
import { CollectionSchema } from "./collections/CollectionSchema";
import { Firestore } from "./types/firestore";
import { BaseDBSchema, BaseSupportedSchemaDef } from "./types/doc_data";

export function collection<
  N extends string,
  D extends BaseSupportedSchemaDef,
  SubCollections extends CollectionSchemas,
>(name: N, schema: D, subCollections: SubCollections = {} as SubCollections) {
  return new CollectionSchema(name, z.object(schema), subCollections);
}

export const tFire = <T extends CollectionSchemas>(
  db: Firestore,
  schema: T
) => {
  let nDB = {} as SchemasToCollections<T>;

  Object.keys(schema).forEach((key) => {
    nDB = {
      ...nDB,
      [key]: schema[key].build(db, ""),
    };
  });

  return {
    ...nDB,
    collection: <k extends string>(
      path: ValidCollectionPath<TrueCollectionSchemas<T>, k>
    ) => createCollection<T, k>(db, schema, path),
    doc<K extends string>(key: ValidDocPath<TrueCollectionSchemas<T>, K>) {
      const segments = key.split("/");
      if (segments.length % 2 !== 0) {
        throw new Error(`Invalid path ${key}`);
      }

      const colPath = segments.slice(0, segments.length - 1).join("/");
      const docId = segments[segments.length - 1];

      const col = this.collection(
        colPath as ValidCollectionPath<TrueCollectionSchemas<T>, K>
      );

      return col.doc(docId) as FindDocTypeFromPath<TrueCollectionSchemas<T>, K>;
    },
  };
};

const createCollection = <T extends CollectionSchemas, K extends string>(
  db: Firestore,
  schema: T,
  path: K
) => {
  const segments = path.split("/");
  if (segments.length % 2 === 0) {
    throw new Error(`Invalid path ${path}`);
  }

  let col: CollectionSchema<string, BaseDBSchema, any> | undefined = undefined;

  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i];
    if (col === undefined) {
      col = Object.values(schema).find((v) => v.name === key);
      if (col === undefined) {
        throw new Error(`Collection ${key} not found`);
      }
    } else {
      const subCols: CollectionSchemas = col.subCollections;
      col = Object.values(subCols).find((v) => v.name === key);
      if (col === undefined) {
        throw new Error(`Collection ${key} not found`);
      }
    }
  }

  if (col === undefined) {
    throw new Error(`Collection ${path} not found`);
  }

  let parentPath = segments.slice(0, segments.length - 1).join("/");

  return col.build(db, parentPath) as unknown as FindCollectionFromPath<
    TrueCollectionSchemas<T>,
    K
  >;
};
