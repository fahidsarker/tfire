import { z, ZodEffects, ZodNullable, ZodType, ZodTypeDef, ZodUnion } from "zod";
import { OptionalFieldValue } from "../types/field-values";
import { FieldValue } from "firebase-admin/firestore";

type SchemaType<
  T extends z.ZodTypeAny,
  Nullable extends boolean,
> = Nullable extends true
  ? ZodUnion<
      [
        ZodNullable<T>,
        ZodEffects<
          ZodType<OptionalFieldValue, ZodTypeDef, OptionalFieldValue>,
          FieldValue,
          OptionalFieldValue
        >,
      ]
    >
  : T;

export type TFSchemaBaseElement = TFireSchemaShapeElement<
  z.ZodTypeAny,
  boolean
>;

export abstract class TFireSchemaShapeElement<
  T extends z.ZodTypeAny,
  Nullable extends boolean = false,
> {
  protected readonly schema: T;
  protected readonly isNullable: Nullable;

  constructor(schema: T, nullable: Nullable) {
    this.schema = schema;
    this.isNullable = nullable;
  }

  build(): SchemaType<T, Nullable> {
    if (this.isNullable) {
      return z.union([
        this.schema.nullable(),
        z.instanceof(OptionalFieldValue).transform((v) => v.build()),
      ]) as SchemaType<T, Nullable>;
    }
    return this.schema as SchemaType<T, Nullable>;
  }
}
