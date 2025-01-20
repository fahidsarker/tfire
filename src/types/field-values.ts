import * as admin from "firebase-admin";
import { number } from "zod";

export type NumActions = "num-inc" | "num-dec";
type ArrayActions = "array-push" | "array-remove";
type DeleteActions = "delete";

export type FieldValueActions = NumActions | ArrayActions | DeleteActions;

type VType<Action extends FieldValueActions> = Action extends "num-inc"
  ? number
  : Action extends "num-dec"
    ? number
    : Action extends "array-push"
      ? Array<any>
      : Action extends "array-remove"
        ? Array<any>
        : Action extends "delete"
          ? undefined
          : never;

export class TFieldValue<Action extends FieldValueActions> {
  private readonly value: VType<Action>;
  private readonly type: Action;

  constructor(value: VType<Action>, type: Action) {
    this.value = value;
    this.type = type;
  }

  build() {
    switch (this.type) {
      case "num-inc":
        return admin.firestore.FieldValue.increment(this.value as number);
      case "num-dec":
        return admin.firestore.FieldValue.increment(-(this.value as number));
      case "array-push":
        return admin.firestore.FieldValue.arrayUnion(this.value);
      case "array-remove":
        return admin.firestore.FieldValue.arrayRemove(this.value);
      case "delete":
        return admin.firestore.FieldValue.delete();
      default:
        throw new Error(`Invalid type ${this.type}`);
    }
  }

  private experimental() {
    // console.log("Hello");
  }
}

export class NumFieldValue extends TFieldValue<NumActions> {
  static increment(n: number) {
    // return admin.firestore.FieldValue.increment(n) as unknown as NumFieldValue;
    return new NumFieldValue(n, "num-inc");
  }

  static decrement(n: number) {
    // return admin.firestore.FieldValue.increment(-n) as unknown as NumFieldValue;
    return new NumFieldValue(-n, "num-dec");
  }
}

export class ArrayFieldValue extends TFieldValue<ArrayActions> {
  static arrayUnion(...elements: any[]) {
    return new ArrayFieldValue(elements, "array-push");
  }

  static arrayRemove(...elements: any[]) {
    return new ArrayFieldValue(elements, "array-remove");
  }
}

export class OptionalFieldValue extends TFieldValue<DeleteActions> {
  static delete() {
    return new OptionalFieldValue(undefined, "delete");
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
