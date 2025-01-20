import { z, ZodAny, ZodRawShape, ZodString, ZodTypeAny } from "zod";
import {
  ArrayFieldValue,
  NumFieldValue,
  OptionalFieldValue,
} from "../types/field-values";
import { Timestamp } from "firebase-admin/firestore";
import { TFStringSchema } from "./string";
import { TFNumberSchema } from "./number";
import { TFTimestampSchema } from "./timestamp";
import { TFBooleanSchema } from "./boolean";
import { TFArraySchema } from "./array";
import { TFireSchemaShapeElement, TFSchemaBaseElement } from "./element";
import { BaseTFireSchemaShape, TFireObjToZod } from "./tfire_schema";
import { TFObjectSchema } from "./object";

export const string = () => new TFStringSchema(z.string(), false);
export const number = () => new TFNumberSchema(z.number(), false);
export const timestamp = () =>
  new TFTimestampSchema(z.instanceof(Timestamp), false);
export const boolean = () => new TFBooleanSchema(z.boolean(), false);
export const array = <T extends TFSchemaBaseElement>(type: T) =>
  new TFArraySchema<T, false>(z.array(type.build() as any), false);
export const object = <T extends BaseTFireSchemaShape>(obj: T) =>
  new TFObjectSchema<T, false>(z.object(TFireObjToZod(obj)), false);

const schema = z.array(z.number().optional());
