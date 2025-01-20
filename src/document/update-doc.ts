import { SafeParseReturnType, z } from "zod";
import { BaseDBSchema, DocData, DocInData } from "../types/doc_data";
import { WriteResult } from "../types/firestore";

export const DocUpdaters = <D extends BaseDBSchema>(
  db: FirebaseFirestore.Firestore,
  schema: D,
  path: string
) => {
  return {
    update: <X extends D>(
      // data: WithFieldValue<DocData<D>>, // todo change to field value
      data: Partial<DocInData<X>>,
      precondition?: FirebaseFirestore.Precondition
    ): Promise<WriteResult> => {
      const v = schema.partial().parse(data);
      return db.doc(path).update(v, precondition ?? {});
    },
  };
};
