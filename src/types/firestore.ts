export type Firestore = FirebaseFirestore.Firestore;
export type DocRef<
  AppModelType = FirebaseFirestore.DocumentData,
  DbModelType extends
    FirebaseFirestore.DocumentData = FirebaseFirestore.DocumentData,
> = FirebaseFirestore.DocumentReference<AppModelType, DbModelType>;

export type DocData = FirebaseFirestore.DocumentData;
