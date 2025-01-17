import { CollectionSchemas } from "../types/collections";
import { Firestore } from "../types/firestore";
import { BaseDBSchema } from "../types/doc_data";
import { createDoc } from "../document/tDocument";

export type DocTypeOfCollection<
  T extends TCollection<string, BaseDBSchema, {}>,
> = ReturnType<typeof createDoc<T["schema"], T["subCollectionSchemas"]>>;

export class TCollection<
  N extends string,
  D extends BaseDBSchema,
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
