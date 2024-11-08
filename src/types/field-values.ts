import * as admin from "firebase-admin";

abstract class TFieldValue {
  private experimental() {
    // console.log("Hello");
  }
}

export class NumFieldValue extends TFieldValue {
  static increment(n: number) {
    return admin.firestore.FieldValue.increment(n) as unknown as NumFieldValue;
  }

  static decrement(n: number) {
    return admin.firestore.FieldValue.increment(-n) as unknown as NumFieldValue;
  }
}

export class ArrayFieldValue extends TFieldValue {
  static arrayUnion(...elements: any[]): TFieldValue {
    return admin.firestore.FieldValue.arrayUnion(
      ...elements,
    ) as unknown as ArrayFieldValue;
  }

  static arrayRemove(...elements: any[]): TFieldValue {
    return admin.firestore.FieldValue.arrayRemove(
      ...elements,
    ) as unknown as ArrayFieldValue;
  }
}

export class OptionalFieldValue extends TFieldValue {
  static delete(): TFieldValue {
    return admin.firestore.FieldValue.delete() as unknown as OptionalFieldValue;
  }
}

export type FieldValueOf<T> = T extends number
  ? NumFieldValue
  : T extends Array<any>
    ? ArrayFieldValue
    : T extends undefined
      ? OptionalFieldValue
      : T extends null
        ? OptionalFieldValue
        : T extends {}
          ? { [K in keyof T]: FieldValueOf<T[K]> }
          : never;

export type WithFieldValue<T> =
  | T
  | (T extends FirebaseFirestore.Primitive
      ? T
      : T extends {}
        ? { [K in keyof T]: WithFieldValue<T[K]> | FieldValueOf<T[K]> }
        : never);
