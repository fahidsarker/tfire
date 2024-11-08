import { CollectionPath } from "./collection-path";
import { Doc, TFireDocument } from "../document";
import { newDocId } from "../helper";
import { DocData, Firestore } from "../types/firestore";
import { WithFieldValue } from "../types/field-values";
import { Query, QueryKey } from "../query";
import { Filter } from "../filter";
import { TFQuery } from "../TFQuery";

export type SubCollectionBaseShape = {
  [key: string]: Collection<string, {}, any>;
};

export class Collection<
  X extends string,
  T extends DocData,
  K extends SubCollectionBaseShape,
> {
  private readonly db: Firestore;
  private readonly subCol: K;
  readonly collectionName: X;
  readonly pathPlaceHolder: CollectionPath;
  constructor(
    db: Firestore,
    collectionName: X,
    subCol: K,
    path: CollectionPath
  ) {
    this.subCol = subCol;
    this.collectionName = collectionName;
    this.pathPlaceHolder = path;
    this.db = db;
  }

  get firestore() {
    return this.db;
  }

  get ref() {
    return this.db.collection(this.path);
  }

  // docIdPlaceHolder = (colName: string) => `__${colName}_DOC_ID__`;

  copy = (
    db: Firestore | undefined,
    newPath: CollectionPath,
    docId: string | undefined
  ) => {
    const nSubCol = {} as any;
    Object.keys(this.subCol).forEach((key) => {
      nSubCol[key] = this.subCol[key].copy(
        db ?? this.db,
        newPath.subRoute(docId, this.subCol[key].collectionName),
        undefined
      );
    });

    return new Collection<X, T, K>(
      db ?? this.db,
      this.collectionName,
      nSubCol,
      newPath
    );
  };

  get path() {
    return this.pathPlaceHolder.path;
  }

  add = <X extends T = T>(data: WithFieldValue<X>) => this.doc().set(data);

  get = <X extends T = T>() => {
    return this.db.collection(this.path).get() as Promise<
      FirebaseFirestore.QuerySnapshot<X, DocData>
    >;
  };

  get query() {
    return new TFQuery<T, Collection<X, T, K>>(this);
  }

  // where<K extends QueryKey<T> = QueryKey<T>>(
  //   fieldPath: K,
  //   opStr: FirebaseFirestore.WhereFilterOp,
  //   value: T[K]
  // ) {
  //   return new Query<T>(this.db.collection(this.path)).where(
  //     fieldPath,
  //     opStr,
  //     value
  //   );
  // }

  limit = (limit: number) => {
    return new Query<T>(this.db.collection(this.path)).limit(limit);
  };

  orderBy = <K extends QueryKey<T>>(
    fieldPath: K,
    directionStr?: FirebaseFirestore.OrderByDirection
  ) => {
    return new Query<T>(this.db.collection(this.path)).orderBy(
      fieldPath,
      directionStr
    );
  };

  where<K extends QueryKey<T> = QueryKey<T>>(
    fieldPath: K,
    opStr: FirebaseFirestore.WhereFilterOp,
    value: T[K]
  ): Query<T>;
  where(filter: Filter<T>): Query<T>;

  where(
    fieldKeyOrFilter: QueryKey<T> | Filter<T>,
    opStr?: FirebaseFirestore.WhereFilterOp,
    value?: T[QueryKey<T>]
  ): Query<T> {
    if (typeof fieldKeyOrFilter === "string") {
      return new Query<T>(this.db.collection(this.path)).where(
        fieldKeyOrFilter,
        opStr!,
        value!
      );
    }

    return new Query<T>(this.db.collection(this.path)).where(fieldKeyOrFilter);
  }

  // getData = () =>
  //   this.get().then((query) => query.docs.map((doc) => doc.data()));

  doc = <X extends T>(id?: string) => {
    const docId = id ?? newDocId(this.db, this.pathPlaceHolder.path);
    return Doc<X, typeof this.subCol>(
      this.db,
      this.pathPlaceHolder,
      docId,
      this.copy(undefined, this.pathPlaceHolder, docId).subCol
    );
  };
}
