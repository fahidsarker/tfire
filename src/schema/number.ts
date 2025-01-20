import { z } from "zod";
import { TFireSchemaShapeElement } from "./element";
import { NumFieldValue } from "../types/field-values";
import { ZodCustomType } from "../types/utils";

export class TFNumberSchema<
  Nullable extends boolean = false,
> extends TFireSchemaShapeElement<z.ZodNumber, Nullable> {
  and = <Nullable extends boolean = false>(
    schema: z.ZodNumber,
    nullable: Nullable
  ) => {
    return new TFNumberSchema(schema, nullable);
  };

  gte = (value: number, message?: string) =>
    this.and(this.schema.gte(value, message), false);
  min = (value: number, message?: string) =>
    this.and(this.schema.min(value, message), false);
  gt = (value: number, message?: string) =>
    this.and(this.schema.gt(value, message), false);
  lte = (value: number, message?: string) =>
    this.and(this.schema.lte(value, message), false);
  max = (value: number, message?: string) =>
    this.and(this.schema.max(value, message), false);
  lt = (value: number, message?: string) =>
    this.and(this.schema.lt(value, message), false);
  int = (message?: string) => this.and(this.schema.int(message), false);
  positive = (message?: string) =>
    this.and(this.schema.positive(message), false);
  negative = (message?: string) =>
    this.and(this.schema.negative(message), false);
  nonpositive = (message?: string) =>
    this.and(this.schema.nonpositive(message), false);
  nonnegative = (message?: string) =>
    this.and(this.schema.nonnegative(message), false);
  multipleOf = (value: number, message?: string) =>
    this.and(this.schema.multipleOf(value, message), false);
  step = (value: number, message?: string) =>
    this.and(this.schema.step(value, message), false);
  finite = (message?: string) => this.and(this.schema.finite(message), false);
  safe = (message?: string) => this.and(this.schema.safe(message), false);

  nullable = () => this.and(this.schema, true);
}
