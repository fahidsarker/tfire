import { z } from "zod";
import { TFireSchemaShapeElement } from "./element";

export class TFStringSchema<
  Nullable extends boolean = false,
> extends TFireSchemaShapeElement<z.ZodString, Nullable> {
  and = <Nullable extends boolean = false>(
    schema: z.ZodString,
    nullable: Nullable
  ) => {
    return new TFStringSchema(schema, nullable);
  };

  email = () => this.and(this.schema.email(), false);
  url = () => this.and(this.schema.url(), false);
  uuid = () => this.and(this.schema.uuid(), false);
  nullable = () => this.and(this.schema, true);
}
