import { SafeParseReturnType } from "zod";
import { CollectionSchemas } from "../types/collections";
import { BaseDBSchema, DocData } from "../types/doc_data";
import { WriteResult } from "../types/firestore";

export const DocDeleters = (db: FirebaseFirestore.Firestore, path: string) => {
  return {
    delete: () => {
      return db.doc(path).delete();
    },
  };
};
