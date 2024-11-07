import { CollectionPath } from "./collections/collection-path";
import { SubCollectionBaseShape } from "./collections/collection";
import { WithFieldValue } from "./types/field-values";
import { DocData, DocRef, Firestore } from "./types/firestore";
import { UpdateData } from "./types/update-data";

export type TFireDocument<
  T extends DocData,
  K extends SubCollectionBaseShape,
> = {
  id: string;
  path: string;
  get: () => Promise<
    FirebaseFirestore.DocumentSnapshot<T, FirebaseFirestore.DocumentData>
  >;
  ref: () => FirebaseFirestore.DocumentReference<T>;
  set: (
    data: WithFieldValue<T>,
    options?: FirebaseFirestore.SetOptions
  ) => Promise<FirebaseFirestore.WriteResult>;
  create: (data: WithFieldValue<T>) => Promise<FirebaseFirestore.WriteResult>;
  update: (
    data: UpdateData<T>,
    precondition?: FirebaseFirestore.Precondition
  ) => Promise<FirebaseFirestore.WriteResult>;
  delete: (
    precondition?: FirebaseFirestore.Precondition
  ) => Promise<FirebaseFirestore.WriteResult>;
  onSnapshot: (
    onNext: (snapshot: FirebaseFirestore.DocumentSnapshot<T, DocData>) => void,
    onError?: (error: Error) => void
  ) => () => void;
} & {
  [key in keyof K]: K[key];
};

export const Doc = <
  T extends FirebaseFirestore.DocumentData,
  K extends SubCollectionBaseShape,
>(
  db: Firestore,
  collectionPath: CollectionPath,
  id: string,
  subCol: K
): TFireDocument<T, K> => {
  const path = `${collectionPath.path}/${id}`;
  const doc = db.doc(path);
  return {
    ...subCol,
    id,
    path,
    ref: () => doc as FirebaseFirestore.DocumentReference<T>,
    get: () =>
      doc.get() as Promise<
        FirebaseFirestore.DocumentSnapshot<T, FirebaseFirestore.DocumentData>
      >,
    getData: () => doc.get().then((doc) => doc.data() as T),
    set: (data: WithFieldValue<T>, options?: FirebaseFirestore.SetOptions) =>
      options ? doc.set(data, options) : doc.set(data),

    create: (data: WithFieldValue<T>) => doc.create(data),
    update: (
      data: UpdateData<T>,
      precondition?: FirebaseFirestore.Precondition
    ) => doc.update(data, precondition ?? {}),

    delete: (precondition?: FirebaseFirestore.Precondition) =>
      doc.delete(precondition ?? {}),

    onSnapshot: (
      onNext: (
        snapshot: FirebaseFirestore.DocumentSnapshot<T, DocData>
      ) => void,
      onError?: (error: Error) => void
    ) =>
      doc.onSnapshot(
        onNext as (
          snapshot: FirebaseFirestore.DocumentSnapshot<
            FirebaseFirestore.DocumentData,
            FirebaseFirestore.DocumentData
          >
        ) => void,
        onError
      ),

    // to be implemented
    // isEqual: <X extends T, u extends SubCollectionBaseShape>(other: Doc<X, s>) => doc.isEqual(other),
  };
  // return db.doc(path) as DocRef<T>;
};
