import { FieldValue } from "firebase-admin/firestore";
import { z, ZodObject, ZodRawShape } from "zod";

export type BaseSupportedSchemaDef = ZodRawShape;
export type BaseDBSchema = ZodObject<BaseSupportedSchemaDef>;
export type DocData<T extends BaseDBSchema> = z.input<T>;

type ExcludedFieldValue<T extends object> = {
  [key in keyof T]: T[key] extends FieldValue | infer U
    ? U extends object
      ? ExcludedFieldValue<U>
      : U
    : T[key] extends object
      ? ExcludedFieldValue<T[key]>
      : T[key];
};
export type DocOutData<T extends BaseDBSchema> = ExcludedFieldValue<
  z.output<T>
>;
export type DocInData<T extends BaseDBSchema> = z.input<T>;

export type SafeData<T> = {};
