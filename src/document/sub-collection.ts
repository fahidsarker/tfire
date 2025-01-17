import {
  CollectionSchemas,
  SchemasToCollections,
  TrueCollectionSchemas,
  ValidCollectionPath,
} from "../types/collections";

export const DocSubCollections = <SubCollections extends CollectionSchemas>(
  subCollections: SchemasToCollections<SubCollections>
) => {
  return {
    collection: <K extends keyof TrueCollectionSchemas<SubCollections>>(
      path: ValidCollectionPath<TrueCollectionSchemas<SubCollections>, K>
    ) => {
      const c = Object.values(subCollections).find((s) => s.name === path);
      if (!c) {
        throw new Error(
          `Collection ${path as string} not found in ${subCollections}`
        );
      }
      return c;
    },
  };
};
