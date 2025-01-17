import { ZodObject, ZodRawShape } from "zod";
import {
  CollectionSchemaBase,
  CollectionSchemas,
  FindCollectionFromPath,
  SchemasToCollections,
  TrueCollectionSchemas,
  ValidCollectionPath,
} from "../types/collections";
import { Firestore } from "../types/firestore";

export type DocTypeOfCollection<
  T extends TCollection<string, ZodObject<ZodRawShape>, {}>,
> = ReturnType<typeof createDoc<T["schema"], T["subCollectionSchemas"]>>;

export class TCollection<
  N extends string,
  D extends ZodObject<ZodRawShape>,
  SubCollections extends CollectionSchemas,
> {
  readonly name: N;
  readonly schema: D;
  readonly subCollectionSchemas: SubCollections;
  readonly parentPath: string;
  private readonly db: Firestore;

  constructor(
    name: N,
    schema: D,
    subCollectionSchemas: SubCollections,
    parentPath: string,
    db: Firestore
  ) {
    this.name = name;
    this.schema = schema;
    this.subCollectionSchemas = subCollectionSchemas;
    this.parentPath = parentPath;
    this.db = db;
  }

  get path() {
    if (this.parentPath === "") {
      return this.name;
    }
    return `${this.parentPath}/${this.name}`;
  }

  get newId() {
    return this.db.collection(this.path).doc().id;
  }

  doc(id?: string): ReturnType<typeof createDoc<D, SubCollections>> {
    id ??= this.newId;

    return createDoc<D, SubCollections>(
      id,
      this.path,
      this.db,
      this.schema,
      this.subCollectionSchemas
    );
  }
}

export const createDoc = <
  D extends ZodObject<ZodRawShape>,
  SubCollections extends CollectionSchemas,
>(
  id: string,
  collectionPath: string,
  db: Firestore,
  schema: D,
  subs: SubCollections
) => {
  let subCols = {} as SchemasToCollections<SubCollections>;

  Object.keys(subs).forEach((key) => {
    subCols = {
      ...subCols,
      [key]: subs[key].build(db, `${collectionPath}/${id}`),
    };
  });

  return {
    id,
    ...subCols,
    collection: <K extends keyof TrueCollectionSchemas<SubCollections>>(
      path: ValidCollectionPath<TrueCollectionSchemas<SubCollections>, K>
    ) => {
      const c = Object.values(subCols).find((s) => s.name === path);
      if (!c) {
        throw new Error(
          `Collection ${path as string} not found in ${collectionPath}`
        );
      }
      return c;
    },
    path: `${collectionPath}/${id}`,
    get: () => db.doc(`${collectionPath}/${id}`).get(),
  };
};
