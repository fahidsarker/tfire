import { z, ZodType, ZodTypeDef } from "zod";
import { TFireSchemaShapeElement } from "./element";
import { Timestamp } from "firebase-admin/firestore";

export class TFTimestampSchema<
  Nullable extends boolean = false,
> extends TFireSchemaShapeElement<
  ZodType<
    InstanceType<typeof Timestamp>,
    ZodTypeDef,
    InstanceType<typeof Timestamp>
  >,
  Nullable
> {
  nullable = () => new TFTimestampSchema(this.schema, true);
}
