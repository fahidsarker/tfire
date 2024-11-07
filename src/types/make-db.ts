import { Collection } from "../collections/collection";
import { CollectionCreator } from "../collections/collection-creator";

export type CreateDB<T extends object> = {
  [K in keyof T]: T[K] extends CollectionCreator<infer X, infer U, infer K>
    ? Collection<X, U, CreateDB<K>>
    : T[K];
};
