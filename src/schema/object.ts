import { z } from "zod";
import { TFireSchemaShapeElement } from "./element";
import {
  BaseTFireSchemaShape,
  BaseTFireSchemaShapeToZod,
} from "./tfire_schema";

export class TFObjectSchema<
  T extends BaseTFireSchemaShape,
  Nullable extends boolean = false,
> extends TFireSchemaShapeElement<
  z.ZodObject<BaseTFireSchemaShapeToZod<T>>,
  Nullable
> {
  nullable = () => new TFObjectSchema<T, true>(this.schema, true);
}
