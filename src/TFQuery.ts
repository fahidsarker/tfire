import { Collection } from "./collections/collection";
import { and, Filter, where } from "./filter";
import { Query, QueryKey } from "./query";
import { DocData } from "./types/firestore";

export type QueryFilter<T extends DocData> =
  | Filter<T>
  | {
      [key in keyof T]?: T[key];
    };

export class TFQuery<T extends DocData, Col extends Collection<string, T, {}>> {
  private readonly _collection: Col;
  public constructor(collection: Col) {
    this._collection = collection;
  }

  private static buildWhere<T extends DocData>(w: QueryFilter<T>): Filter<T> {
    if (w instanceof Filter) {
      return w;
    }

    return and(
      ...Object.entries(w).map(([key, value]) => {
        return where<{
          [key in keyof T]: T[key];
        }>(key as QueryKey<T>, "==", value);
      })
    );
  }

  findFirst = async (q?: {
    where?: QueryFilter<T>;
    orderBy?: {
      [key in keyof T]?: "asc" | "desc";
    };
  }): Promise<T | undefined> => {
    const { where } = q ?? {};

    let query: Col | Query<T> = this._collection;

    if (where) {
      query = query.where(TFQuery.buildWhere(where));
    }

    query = query.limit(1);

    for (const [key, value] of Object.entries(q?.orderBy ?? {})) {
      query = query.orderBy(key as QueryKey<T>, value);
    }

    const snap = await query.get();

    return snap.docs[0]?.data();
  };

  findMany = async (q?: {
    where?: QueryFilter<T>;
    limit?: number;
    orderBy?: {
      [key in keyof T]?: FirebaseFirestore.OrderByDirection;
    };
  }): Promise<T[]> => {
    const { where, limit } = q ?? {};

    let query: Col | Query<T> = this._collection;

    if (where) {
      query = query.where(TFQuery.buildWhere(where));
    }

    for (const [key, value] of Object.entries(q?.orderBy ?? {})) {
      query = query.orderBy(key as QueryKey<T>, value);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const snap = await query.get();

    return snap.docs.map((doc) => doc.data());
  };
}
