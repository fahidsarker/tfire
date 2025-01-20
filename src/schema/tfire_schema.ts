import { z } from "zod";
import { TFireSchemaShapeElement } from "./element";
import { FieldValueActions, TFieldValue } from "../types/field-values";

export type BaseTFireSchemaShape = {
  [key: string]: TFireSchemaShapeElement<z.ZodTypeAny, boolean>;
};

export type BaseTFireSchemaShapeToZod<T extends BaseTFireSchemaShape> = {
  [key in keyof T]: ReturnType<T[key]["build"]>;
};

export const TFireObjToZod = <T extends BaseTFireSchemaShape>(obj: T) => {
  let nObj = {} as BaseTFireSchemaShapeToZod<T>;
  Object.keys(obj).forEach((key) => {
    // nObj[key] = obj[key].build();
    nObj = {
      ...nObj,
      [key]: obj[key].build(),
    };
  });
  return nObj;
};
