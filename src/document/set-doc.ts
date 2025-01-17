import { SafeParseReturnType } from "zod";
import { CollectionSchemas } from "../types/collections";
import { BaseDBSchema, DocData } from "../types/doc_data";
import { WriteResult } from "../types/firestore";

export const setDocData = <D extends BaseDBSchema>(
  db: FirebaseFirestore.Firestore,
  schema: D,
  path: string,
  // data: WithFieldValue<DocData<D>>, // todo change to field value
  data: DocData<D>,
  options?: FirebaseFirestore.SetOptions
): Promise<WriteResult> => {
  const v = schema.parse(data);
  return options ? db.doc(path).set(v, options) : db.doc(path).set(v);
};

export const safeSetDocData = async <D extends BaseDBSchema>(
  db: FirebaseFirestore.Firestore,
  schema: D,
  path: string,
  // data: WithFieldValue<DocData<D>>, // todo change to field value
  data: DocData<D>,
  options?: FirebaseFirestore.SetOptions
): Promise<SafeParseReturnType<DocData<D>, WriteResult>> => {
  const v = schema.safeParse(data);

  if (v.success === false) {
    return v;
  }

  return {
    ...v,
    data: options
      ? await db.doc(path).set(v, options)
      : await db.doc(path).set(v),
  };
};
