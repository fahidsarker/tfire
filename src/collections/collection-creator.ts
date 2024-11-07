import { DocData } from "../types/firestore";
import { Collection } from "./collection";

export type CollectionCreatorBaseShape = {
  [key: string]: CollectionCreator<string, {}, any>;
};

// export type CreatorOnlyBaseShape<T extends CollectionCreatorBaseShape> = {
//   [K in keyof T]: CreatorOnly<T[K]>;
// };

export class CollectionCreator<
  X extends string,
  T extends DocData,
  K extends CollectionCreatorBaseShape,
> extends Collection<X, T, K> {
  sub = <K extends CollectionCreatorBaseShape>(subCol: K) => {
    return new CollectionCreator<X, T, K>(
      this.firestore,
      this.collectionName,
      subCol,
      this.pathPlaceHolder
    );
  };
}

// export type CreatorOnly<T extends CollectionCreator<string, {}, any>> =
//   T extends CollectionCreator<string, {}, any>
//     ? {
//         sub: T["sub"];
//       }
//     : never;
