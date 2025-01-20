import { SafeParseReturnType } from "zod";
import { BaseDBSchema, DocOutData } from "../types/doc_data";

export const DocGetters = <D extends BaseDBSchema>(
  db: FirebaseFirestore.Firestore,
  schema: D,
  path: string
) => {
  return {
    get: async (): Promise<
      FirebaseFirestore.DocumentSnapshot<DocOutData<D>, DocOutData<D>>
    > => {
      const res = await db.doc(path).get();
      const dta = res.data();
      if (!dta) {
        return res as FirebaseFirestore.DocumentSnapshot<
          DocOutData<D>,
          DocOutData<D>
        >;
      }
      schema.parse(dta);
      return res as FirebaseFirestore.DocumentSnapshot<
        DocOutData<D>,
        DocOutData<D>
      >;
    },
    safeGet: async (): Promise<
      SafeParseReturnType<
        DocOutData<D>,
        FirebaseFirestore.DocumentSnapshot<DocOutData<D>, DocOutData<D>>
      >
    > => {
      const res = await db.doc(path).get();
      const dta = res.data();
      if (!dta) {
        return {
          success: true,
          data: res as FirebaseFirestore.DocumentSnapshot<
            DocOutData<D>,
            DocOutData<D>
          >,
        };
      }
      const parseRes = schema.safeParse(dta);
      if (parseRes.success === false) {
        return parseRes as SafeParseReturnType<
          DocOutData<D>,
          FirebaseFirestore.DocumentSnapshot<DocOutData<D>, DocOutData<D>>
        >;
      }

      return {
        success: true,
        data: res as FirebaseFirestore.DocumentSnapshot<
          DocOutData<D>,
          DocOutData<D>
        >,
      };
    },
  };
};
