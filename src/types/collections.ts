import { ZodObject, ZodRawShape } from "zod";
import { CollectionSchema } from "../collections/CollectionSchema";
import { createDoc, TCollection } from "../collections/tCollection";

export type CollectionSchemaBase = CollectionSchema<
  string,
  ZodObject<ZodRawShape>,
  {}
>;
export type CollectionSchemas = {
  [key: string]: CollectionSchemaBase;
};

export type TrueCollectionSchema<Schema extends CollectionSchemaBase> =
  Schema & {
    _TrueCol: true;
  };

export type TrueCollectionSchemas<Schemas extends CollectionSchemas> = {
  [key in keyof Schemas as Schemas[key]["name"]]: TrueCollectionSchema<
    Schemas[key]
  >;
};

export type SchemasToCollections<Schemas extends CollectionSchemas> = {
  [key in keyof Schemas]: SchemaToCollection<Schemas[key]>;
};

export type SchemaToCollection<
  Schema extends
    | CollectionSchemaBase
    | TrueCollectionSchema<CollectionSchemaBase>,
> = TCollection<Schema["name"], Schema["schema"], Schema["subCollections"]>;

export type CollectionToSchema<
  Collection extends TCollection<string, ZodObject<ZodRawShape>, {}>,
> = CollectionSchema<
  Collection["name"],
  Collection["schema"],
  Collection["subCollectionSchemas"]
>;

export type FindCollectionFromPath<
  T extends TrueCollectionSchemas<CollectionSchemas>,
  P extends string,
> = P extends ""
  ? never
  : P extends keyof T
    ? SchemaToCollection<T[P]>
    : P extends `${infer X}/${infer Doc}/${infer Y}`
      ? Doc extends ""
        ? never
        : X extends keyof T
          ? Y extends ""
            ? SchemaToCollection<T[X]>
            : FindCollectionFromPath<
                TrueCollectionSchemas<T[X]["subCollections"]>,
                Y
              >
          : never
      : never;

export type FindDocTypeFromPath<
  T extends TrueCollectionSchemas<CollectionSchemas>,
  P extends string,
> = P extends ""
  ? never
  : P extends keyof T
    ? never
    : P extends `${infer X}/${infer Doc}/${infer Y}`
      ? Doc extends ""
        ? never
        : X extends keyof T
          ? FindDocTypeFromPath<
              TrueCollectionSchemas<T[X]["subCollections"]>,
              Y
            >
          : never
      : P extends `${infer X}/${infer Doc}`
        ? Doc extends ""
          ? never
          : X extends keyof T
            ? ReturnType<
                typeof createDoc<T[X]["schema"], T[X]["subCollections"]>
              >
            : never
        : never;

export type ValidCollectionPath<
  Col extends TrueCollectionSchemas<CollectionSchemas>,
  Key extends string,
> = FindCollectionFromPath<Col, Key> extends never ? never : Key;

export type ValidDocPath<
  Col extends TrueCollectionSchemas<CollectionSchemas>,
  Key extends string,
> = FindDocTypeFromPath<Col, Key> extends never ? never : Key;
