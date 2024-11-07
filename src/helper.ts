import * as admin from "firebase-admin";
import { Firestore } from "./types/firestore";
export const newDocId = (db: Firestore, collectionPath: string) =>
  db.collection(collectionPath).doc().id;
