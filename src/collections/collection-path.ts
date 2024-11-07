import admin from "firebase-admin";

export class CollectionPath {
  private readonly parentCollectionPath: CollectionPath | undefined;
  private readonly collectionName: string;
  private readonly parentDocId: string | undefined;

  private constructor(
    parentCollectionPath: CollectionPath | undefined,
    parentDocId: string | undefined,
    collectionName: string
  ) {
    this.parentCollectionPath = parentCollectionPath;
    this.collectionName = collectionName;
    this.parentDocId = parentDocId;
  }

  static createRoot = (collectionName: string) => {
    return new CollectionPath(undefined, undefined, collectionName);
  };

  subRoute = (parentDocId: string | undefined, collectionName: string) => {
    const parentDID = parentDocId;
    return new CollectionPath(this, parentDID, collectionName);
  };

  get path(): string {
    if (this.parentCollectionPath === undefined) {
      return this.collectionName;
    }

    if (this.parentDocId === undefined) {
      throw new Error(
        `parentDocId is undefined:: for parentCollectionPath: ${this.parentCollectionPath.path} and collectionName: ${this.collectionName}`
      );
    }

    return `${this.parentCollectionPath.path}/${this.parentDocId}/${this.collectionName}`;
  }
}
