import { CollectionSchemas, SchemasToCollections } from "../types/collections";
import { BaseDBSchema, DocData } from "../types/doc_data";
import { Firestore } from "../types/firestore";
import { DocGetters } from "./get-doc";
import { DocDeleters } from "./remove-doc";
import { DocSetters } from "./set-doc";
import { DocSubCollections } from "./sub-collection";
import { DocUpdaters } from "./update-doc";

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

  const docPath = `${collectionPath}/${id}`;

  return {
    id: id,
    path: `${collectionPath}/${id}`,

    ...subCols,
    ...DocSubCollections<SubCollections>(subCols),
    ...DocSetters<D>(db, schema, docPath),
    ...DocUpdaters<D>(db, schema, docPath),
    ...DocGetters<D>(db, schema, docPath),
    ...DocDeleters(db, docPath),
    // safeSet: doc.safeSet,
    // get: doc.get,
  };
};
