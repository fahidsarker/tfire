import { Collection, SubCollectionBaseShape } from "../collections/collection";

type SubCollection<T extends Collection<string, unknown, {}>> =
  T extends Collection<string, unknown, infer K>
    ? K extends {}
      ? K[keyof K]
      : never
    : never;

type SubCollectionNames<T extends Collection<string, unknown, {}>> =
  SubCollection<T>["collectionName"];

// convert {key: Collection} to {collectionName: Collection}
type TrueCollectionMap<T extends Collection<string, unknown, {}>> =
  T extends Collection<infer K, unknown, {}>
    ? {
        [key in K]: T;
      }
    : never;

// type TrueSubCollections<T extends CollectionBaseShape, B extends {}> = {
//   [key in keyof TrueCollectionMap<T[keyof T]>]: TrueCollectionMap<
//     T[keyof T]
//   >[key];
// };

type TrueSubCollections<T extends SubCollectionBaseShape> = TrueCollectionMap<
  T[keyof T]
>;

type TrueSubCollection<T extends Collection<string, unknown, {}>> =
  T extends Collection<string, unknown, infer K>
    ? TrueSubCollections<K>
    : never;

type CollectionPathFrom<T extends Collection<string, unknown, {}>> =
  T extends Collection<string, unknown, infer K>
    ? K extends {}
      ?
          | T["collectionName"]
          // @ts-ignore
          | `${T["collectionName"]}/${string}/${CollectionPathFrom<
              SubCollection<T>
            >}`
      : never
    : never;
