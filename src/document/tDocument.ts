import { SafeParseReturnType } from "zod";
import {
  CollectionSchemas,
  SchemasToCollections,
  TrueCollectionSchemas,
  ValidCollectionPath,
} from "../types/collections";
import { BaseDBSchema, DocData } from "../types/doc_data";
import { Firestore, WriteResult } from "../types/firestore";

export class TDocument<
  D extends BaseDBSchema,
  SubCollections extends CollectionSchemas,
> {
  readonly id: string;
  readonly path: string;
  private readonly subCollections: SchemasToCollections<SubCollections>;
  private readonly db: Firestore;
  private readonly schema: D;

  constructor(
    id: string,
    path: string,
    db: Firestore,
    schema: D,
    subCollections: SchemasToCollections<SubCollections>
  ) {
    this.id = id;
    this.path = path;
    this.db = db;
    this.schema = schema;
    this.subCollections = subCollections;
  }

  collection = <K extends keyof TrueCollectionSchemas<SubCollections>>(
    path: ValidCollectionPath<TrueCollectionSchemas<SubCollections>, K>
  ) => {
    const c = Object.values(this.subCollections).find((s) => s.name === path);
    if (!c) {
      throw new Error(
        `Collection ${path as string} not found in ${this.subCollections}`
      );
    }
    return c;
  };

  // set(
  //   data: PartialWithFieldValue<AppModelType>,
  //   options: SetOptions
  // ): Promise<WriteResult>;
  // set(data: WithFieldValue<AppModelType>): Promise<WriteResult>;

  // set(
  //   // data: WithFieldValue<DocData<D>>, // todo change to field value
  //   data: DocData<D>,
  //   options?: FirebaseFirestore.SetOptions
  // ): Promise<WriteResult> {
  //   const v = this.schema.parse(data);
  //   return options
  //     ? this.db.doc(this.path).set(v, options)
  //     : this.db.doc(this.path).set(v);
  // }

  // async safeSet(
  //   // data: WithFieldValue<DocData<D>>, // todo change to field value
  //   data: DocData<D>,
  //   options?: FirebaseFirestore.SetOptions
  // ): Promise<SafeParseReturnType<DocData<D>, WriteResult>> {
  //   const v = this.schema.safeParse(data);

  //   if (v.success === false) {
  //     return v;
  //   }

  //   return {
  //     ...v,
  //     data: options
  //       ? await this.db.doc(this.path).set(v, options)
  //       : await this.db.doc(this.path).set(v),
  //   };
  // }

  get = async (): Promise<
    FirebaseFirestore.DocumentSnapshot<DocData<D>, DocData<D>>
  > => {
    const res = await this.db.doc(this.path).get();
    const dta = res.data();
    if (!dta) {
      return res;
    }
    this.schema.parse(dta);
    return res;
  };
}
