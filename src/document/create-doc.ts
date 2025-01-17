import { CollectionSchemas, SchemasToCollections } from "../types/collections";
import { BaseDBSchema, DocData } from "../types/doc_data";
import { Firestore } from "../types/firestore";
import { DocGetters } from "./get-doc";
import { safeSetDocData, setDocData } from "./set-doc";
import { TDocument } from "./tDocument";

export const createDoc = <
  D extends BaseDBSchema,
  SubCollections extends CollectionSchemas,
>(
  id: string,
  collectionPath: string,
  db: Firestore,
  schema: D,
  subs: SubCollections
) => {
  let subCols = {} as SchemasToCollections<SubCollections>;

  Object.keys(subs).forEach((key) => {
    subCols = {
      ...subCols,
      [key]: subs[key].build(db, `${collectionPath}/${id}`),
    };
  });

  const doc = new TDocument<D, SubCollections>(
    id,
    `${collectionPath}/${id}`,
    db,
    schema,
    subCols
  );

  return {
    id: doc.id,
    path: doc.path,
    collection: doc.collection,
    ...subCols,
    set: <X extends D>(
      data: DocData<X>,
      options?: FirebaseFirestore.SetOptions
    ) => setDocData(db, schema, doc.path, data, options),
    safeSet: <X extends D>(
      data: DocData<X>,
      options?: FirebaseFirestore.SetOptions
    ) => safeSetDocData(db, schema, doc.path, data, options),
    ...DocGetters<D>(db, schema, doc.path),
    // safeSet: doc.safeSet,
    // get: doc.get,
  };
};
