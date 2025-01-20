import { z } from "zod";
import { TFireSchemaShapeElement } from "./element";

export class TFBooleanSchema<
  Nullable extends boolean = false,
> extends TFireSchemaShapeElement<z.ZodBoolean, Nullable> {
  nullable = () => new TFBooleanSchema(this.schema, true);
}
