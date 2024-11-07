import { FieldValueOf } from "./field-values";

export type UpdateData<T> = T extends FirebaseFirestore.Primitive
  ? T
  : T extends {}
    ? {
        [K in keyof T]?: UpdateData<T[K]> | FieldValueOf<T[K]>;
      } & NestedUpdateFields<T>
    : Partial<T>;

type NestedUpdateFields<T extends Record<string, unknown>> =
  FirebaseFirestore.UnionToIntersection<
    {
      [K in keyof T & string]: ChildUpdateFields<K, T[K]>;
    }[keyof T & string] // Also include the generated prefix-string keys.
  >;

type ChildUpdateFields<K extends string, V> =
  // Only allow nesting for map values
  V extends Record<string, unknown>
    ? // Recurse into the map and add the prefix in front of each key
      // (e.g. Prefix 'bar.' to create: 'bar.baz' and 'bar.qux'.
      AddPrefixToKeys<K, UpdateData<V>>
    : // UpdateData is always a map of values.
      never;

/**
 * Returns a new map where every key is prefixed with the outer key appended
 * to a dot.
 */
type AddPrefixToKeys<Prefix extends string, T extends Record<string, unknown>> =
  // Remap K => Prefix.K. See https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
  { [K in keyof T & string as `${Prefix}.${K}`]+?: T[K] };
