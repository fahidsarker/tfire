import {
  ZodEffects,
  ZodNumber,
  ZodType,
  ZodTypeAny,
  ZodTypeDef,
  ZodUnion,
} from "zod";
import {
  FieldValueActions,
  NumActions,
  NumFieldValue,
  TFieldValue,
} from "./field-values";

declare abstract class Class {
  constructor(..._: any[]);
}
export type ZodCustomType<T extends typeof Class> = ZodType<
  InstanceType<T>,
  ZodTypeDef,
  InstanceType<T>
>;
