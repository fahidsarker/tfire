import { z } from "zod";
import { TFireSchemaShapeElement } from "./element";
import { ArrayFieldValue } from "../types/field-values";

export class TFArraySchema<
  T extends TFireSchemaShapeElement<z.ZodTypeAny, boolean>,
  Nullable extends boolean = false,
> extends TFireSchemaShapeElement<
  z.ZodArray<ReturnType<T["build"]>>,
  Nullable
> {
  nullable = () => new TFArraySchema<T, true>(this.schema, true);
}
