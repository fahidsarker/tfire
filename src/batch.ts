import { SubCollectionBaseShape } from "./collections/collection";
import { TFireDocument } from "./document";
import { StringKeysOf } from "./query";
import { WithFieldValue } from "./types/field-values";
import { DocData, Firestore } from "./types/firestore";
import { UpdateData } from "./types/update-data";
import * as admin from "firebase-admin";

export class TFireBatch {
  private readonly batch: admin.firestore.WriteBatch;
  constructor(batch: admin.firestore.WriteBatch) {
    this.batch = batch;
  }

  create<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    data: WithFieldValue<T>,
  ) {
    this.batch.create<DocData, DocData>(documentRef.ref(), data);
    return this;
  }

  set<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    data: WithFieldValue<T>,
    options?: FirebaseFirestore.SetOptions,
  ) {
    if (options) {
      this.batch.set<DocData, DocData>(documentRef.ref(), data, options);
    } else {
      this.batch.set<DocData, DocData>(documentRef.ref(), data);
    }
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
    precondition?: FirebaseFirestore.Precondition,
  ) {
    this.batch.update<DocData, DocData>(
      documentRef.ref(),
      data,
      precondition ?? {},
    );
    return this;
  }

  delete<T extends DocData, K extends SubCollectionBaseShape>(
    documentRef: TFireDocument<T, K>,
    precondition?: FirebaseFirestore.Precondition,
  ) {
    this.batch.delete(documentRef.ref(), precondition ?? {});
    return this;
  }

  commit() {
    return this.batch.commit();
  }

  /**
   * Updates fields in the document referred to by the provided
   * `DocumentReference`. The update will fail if applied to a document that
   * does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path
   * strings or by providing FieldPath objects.
   *
   * A `Precondition` restricting this update can be specified as the last
   * argument.
   *
   * @param documentRef A reference to the document to be updated.
   * @param field The first field to update.
   * @param value The first value
   * @param fieldsOrPrecondition An alternating list of field paths and values
   * to update, optionally followed a `Precondition` to enforce on this
   * update.
   * @throws Error If the provided input is not valid Firestore data.
   * @return This `WriteBatch` instance. Used for chaining method calls.
   */
  //   update(
  //     documentRef: DocumentReference<any, any>,
  //     field: string | FieldPath,
  //     value: any,
  //     ...fieldsOrPrecondition: any[]
  //   ): WriteBatch;
}
