import { SafeParseReturnType } from "zod";
import { BaseDBSchema, DocData } from "../types/doc_data";

export const DocGetters = <D extends BaseDBSchema>(
  db: FirebaseFirestore.Firestore,
  schema: D,
  path: string
) => {
  return {
    get: async (): Promise<
      FirebaseFirestore.DocumentSnapshot<DocData<D>, DocData<D>>
    > => {
      const res = await db.doc(path).get();
      const dta = res.data();
      if (!dta) {
        return res;
      }
      schema.parse(dta);
      return res;
    },
    safeGet: async (): Promise<
      SafeParseReturnType<
        DocData<D>,
        FirebaseFirestore.DocumentSnapshot<DocData<D>, DocData<D>>
      >
    > => {
      const res = await db.doc(path).get();
      const dta = res.data();
      if (!dta) {
        return {
          success: true,
          data: res,
        };
      }
      const parseRes = schema.safeParse(dta);
      if (parseRes.success === false) {
        return parseRes;
      }

      return {
        success: true,
        data: res,
      };
    },
  };
};
