import { Collection, SubCollectionBaseShape } from "./collections/collection";
import { TFireDocument } from "./document";
import { WithFieldValue } from "./types/field-values";
import { DocData } from "./types/firestore";
import { UpdateData } from "./types/update-data";
import * as admin from "firebase-admin";

export class TFireBatch {
  private readonly batch: admin.firestore.WriteBatch;
  constructor(batch: admin.firestore.WriteBatch) {
    this.batch = batch;
  }

  create<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    data: WithFieldValue<T>
  ) {
    this.batch.create<DocData, DocData>(documentRef.ref(), data);
    return this;
  }

  set<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    data: WithFieldValue<T>,
    options?: FirebaseFirestore.SetOptions
  ) {
    if (options) {
      this.batch.set<DocData, DocData>(documentRef.ref(), data, options);
    } else {
      this.batch.set<DocData, DocData>(documentRef.ref(), data);
    }
    return this;
  }

  add<X extends string, T extends DocData, K extends SubCollectionBaseShape>(
    collectionRef: Collection<X, T, K>,
    data: WithFieldValue<T>
  ) {
    this.batch.create<DocData, DocData>(collectionRef.ref.doc(), data);
    return this;
  }

  //   update<T extends DocData,  K extends SubCollectionBaseShape, X extends StringKeysOf<T>>(
  //     documentRef: TFireDocument<T, K>,
  //     field: X,
  //     value: T[X],
  //     ...fieldsOrPrecondition: any[]
  //   ): TFireBatch;

  //   update<T extends DocData,  K extends SubCollectionBaseShape>(
  //     documentRef: TFireDocument<T, K>,
  //     data: UpdateData<T>,
  //     precondition?: FirebaseFirestore.Precondition
  //   ): TFireBatch;

  update<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    data: UpdateData<T>,
    precondition?: FirebaseFirestore.Precondition
  ) {
    this.batch.update<DocData, DocData>(
      documentRef.ref(),
      data,
      precondition ?? {}
    );
    return this;
  }

  delete<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    precondition?: FirebaseFirestore.Precondition
  ) {
    this.batch.delete(documentRef.ref(), precondition ?? {});
    return this;
  }

  commit() {
    return this.batch.commit();
  }
}
