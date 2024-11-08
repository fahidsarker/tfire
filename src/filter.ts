import { QueryKey } from "./query";
import { DocData } from "./types/firestore";

import * as admin from "firebase-admin";
export class Filter<T extends DocData> {
  readonly filter: admin.firestore.Filter;

  constructor(filter: admin.firestore.Filter) {
    this.filter = filter;
  }

  private experimental() {}
}

export const where = <T extends DocData, K extends QueryKey<T> = QueryKey<T>>(
  fieldPath: K,
  opStr: admin.firestore.WhereFilterOp,
  value: T[K]
): Filter<T> => {
  return new Filter(admin.firestore.Filter.where(fieldPath, opStr, value));
};

export const or = <T extends DocData>(...filters: Filter<T>[]) => {
  return new Filter<T>(
    admin.firestore.Filter.or(...filters.map((f) => f.filter))
  );
};

export const and = <T extends DocData>(...filters: Filter<T>[]) => {
  return new Filter<T>(
    admin.firestore.Filter.and(...filters.map((f) => f.filter))
  );
};
