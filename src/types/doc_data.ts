import { z, ZodObject, ZodRawShape } from "zod";

export type BaseSupportedSchemaDef = ZodRawShape;
export type BaseDBSchema = ZodObject<BaseSupportedSchemaDef>;
export type DocData<T extends BaseDBSchema> = z.infer<T>;

export type SafeData<T> = {};
