import { DocData, Firestore } from "./types/firestore";
import * as admin from "firebase-admin";
export type QueryKey<T extends DocData> = keyof T extends string
  ? keyof T
  : never;

export type StringKeysOf<T extends DocData> = keyof T extends string
  ? keyof T
  : never;

export class Query<T extends DocData> {
  private readonly query:
    | FirebaseFirestore.Query
    | FirebaseFirestore.CollectionReference;
  constructor(
    query: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference
  ) {
    this.query = query;
  }

  private subQuery(q: FirebaseFirestore.Query): Query<T> {
    return new Query<T>(q);
  }

  where<K extends QueryKey<T> = QueryKey<T>>(
    fieldPath: K,
    opStr: FirebaseFirestore.WhereFilterOp,
    value: T[K]
  ): Query<T> {
    return this.subQuery(this.query.where(fieldPath, opStr, value));
  }

  // where(filter: Filter): Query<AppModelType, DbModelType>;

  orderBy(
    fieldPath: QueryKey<T>,
    directionStr?: FirebaseFirestore.OrderByDirection
  ) {
    return this.subQuery(this.query.orderBy(fieldPath, directionStr));
  }

  limit(limit: number) {
    return this.subQuery(this.query.limit(limit));
  }

  limitToLast(limit: number) {
    return this.subQuery(this.query.limitToLast(limit));
  }

  offset(offset: number) {
    return this.subQuery(this.query.offset(offset));
  }

  select<X extends StringKeysOf<T>>(...field: X[]) {
    return new Query<{
      [K in X]: T[K];
    }>(this.query.select(...field));
  }

  startAt(snapshot: FirebaseFirestore.DocumentSnapshot<T, any>) {
    return this.subQuery(this.query.startAt(snapshot));
  }

  /**
   * Creates and returns a new Query that starts at the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query at, in order
   * of the query's order by.
   * @return The created Query.
   */
  //   startAt(...fieldValues: any[]): Query<AppModelType, DbModelType>;

  startAfter(snapshot: FirebaseFirestore.DocumentSnapshot<T, any>) {
    return this.subQuery(this.query.startAfter(snapshot));
  }

  /**
   * Creates and returns a new Query that starts after the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query after, in order
   * of the query's order by.
   * @return The created Query.
   */
  //   startAfter(...fieldValues: any[]): Query<AppModelType, DbModelType>;

  endBefore(snapshot: FirebaseFirestore.DocumentSnapshot<T, any>) {
    return this.subQuery(this.query.endBefore(snapshot));
  }

  /**
   * Creates and returns a new Query that ends before the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query before, in order
   * of the query's order by.
   * @return The created Query.
   */
  //   endBefore(...fieldValues: any[]): Query<AppModelType, DbModelType>;

  endAt(snapshot: FirebaseFirestore.DocumentSnapshot<T, any>) {
    return this.subQuery(this.query.endAt(snapshot));
  }

  /**
   * Creates and returns a new Query that ends at the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query at, in order
   * of the query's order by.
   * @return The created Query.
   */
  //   endAt(...fieldValues: any[]): Query<AppModelType, DbModelType>;

  get(): Promise<FirebaseFirestore.QuerySnapshot<T, DocData>> {
    return this.query.get() as Promise<
      FirebaseFirestore.QuerySnapshot<T, DocData>
    >;
  }

  /**
   * Plans and optionally executes this query. Returns a Promise that will be
   * resolved with the planner information, statistics from the query execution (if any),
   * and the query results (if any).
   *
   * @return A Promise that will be resolved with the planner information, statistics
   *  from the query execution (if any), and the query results (if any).
   */
  //   explain(
  //     options?: ExplainOptions
  //   ): Promise<ExplainResults<QuerySnapshot<AppModelType, DbModelType>>>;

  /**
   * Executes the query and returns the results as Node Stream.
   *
   * @return A stream of QueryDocumentSnapshot.
   */
  //   stream(): NodeJS.ReadableStream;

  /**
   * Plans and optionally executes this query, and streams the results as Node Stream
   * of `{document?: DocumentSnapshot, metrics?: ExplainMetrics}` objects.
   *
   * The stream surfaces documents one at a time as they are received from the
   * server, and at the end, it will surface the metrics associated with
   * executing the query (if any).
   *
   * @example
   * ```
   * let query = firestore.collection('col').where('foo', '==', 'bar');
   * let count = 0;
   *
   * query.explainStream({analyze: true}).on('data', (data) => {
   *   if (data.document) {
   *     // Use data.document which is a DocumentSnapshot instance.
   *     console.log(`Found document with name '${data.document.id}'`);
   *     ++count;
   *   }
   *   if (data.metrics) {
   *     // Use data.metrics which is an ExplainMetrics instance.
   *   }
   * }).on('end', () => {
   *   console.log(`Received ${count} documents.`);
   * });
   * ```
   *
   * @return A stream of `{document?: DocumentSnapshot, metrics?: ExplainMetrics}`
   * objects.
   */
  //   explainStream(options?: ExplainOptions): NodeJS.ReadableStream;

  /**
   * Attaches a listener for `QuerySnapshot `events.
   *
   * @param onNext A callback to be called every time a new `QuerySnapshot`
   * is available.
   * @param onError A callback to be called if the listen fails or is
   * cancelled. No further callbacks will occur.
   * @return An unsubscribe function that can be called to cancel
   * the snapshot listener.
   */
  //   onSnapshot(
  //     onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void,
  //     onError?: (error: Error) => void
  //   ): () => void;

  /**
   * Returns a query that counts the documents in the result set of this
   * query.
   *
   * The returned query, when executed, counts the documents in the result set
   * of this query without actually downloading the documents.
   *
   * Using the returned query to count the documents is efficient because only
   * the final count, not the documents' data, is downloaded. The returned
   * query can count the documents in cases where the result set is
   * prohibitively large to download entirely (thousands of documents).
   *
   * @return a query that counts the documents in the result set of this
   * query. The count can be retrieved from `snapshot.data().count`, where
   * `snapshot` is the `AggregateQuerySnapshot` resulting from running the
   * returned query.
   */
  //   count(): AggregateQuery<
  //     { count: AggregateField<number> },
  //     AppModelType,
  //     DbModelType
  //   >;

  /**
   * Returns a query that can perform the given aggregations.
   *
   * The returned query, when executed, calculates the specified aggregations
   * over the documents in the result set of this query without actually
   * downloading the documents.
   *
   * Using the returned query to perform aggregations is efficient because only
   * the final aggregation values, not the documents' data, is downloaded. The
   * returned query can perform aggregations of the documents in cases where
   * the result set is prohibitively large to download entirely (thousands of
   * documents).
   *
   * @param aggregateSpec An `AggregateSpec` object that specifies the aggregates
   * to perform over the result set. The AggregateSpec specifies aliases for each
   * aggregate, which can be used to retrieve the aggregate result.
   * @example
   * ```typescript
   * const aggregateQuery = col.aggregate(query, {
   *   countOfDocs: count(),
   *   totalHours: sum('hours'),
   *   averageScore: average('score')
   * });
   *
   * const aggregateSnapshot = await aggregateQuery.get();
   * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
   * const totalHours: number = aggregateSnapshot.data().totalHours;
   * const averageScore: number | null = aggregateSnapshot.data().averageScore;
   * ```
   */
  //   aggregate<T extends AggregateSpec>(
  //     aggregateSpec: T
  //   ): AggregateQuery<T, AppModelType, DbModelType>;

  /**
   * Returns a query that can perform vector distance (similarity) search with given parameters.
   *
   * The returned query, when executed, performs a distance (similarity) search on the specified
   * `vectorField` against the given `queryVector` and returns the top documents that are closest
   * to the `queryVector`.
   *
   * Only documents whose `vectorField` field is a {@link VectorValue} of the same dimension as `queryVector`
   * participate in the query, all other documents are ignored.
   *
   * @example
   * ```
   * // Returns the closest 10 documents whose Euclidean distance from their 'embedding' fields are closed to [41, 42].
   * const vectorQuery = col.findNearest('embedding', [41, 42], {limit: 10, distanceMeasure: 'EUCLIDEAN'});
   *
   * const querySnapshot = await aggregateQuery.get();
   * querySnapshot.forEach(...);
   * ```
   *
   * @param vectorField - A string or {@link FieldPath} specifying the vector field to search on.
   * @param queryVector - The {@link VectorValue} used to measure the distance from `vectorField` values in the documents.
   * @param options - Options control the vector query. `limit` specifies the upper bound of documents to return, must
   * be a positive integer with a maximum value of 1000. `distanceMeasure` specifies what type of distance is calculated
   * when performing the query.
   *
   * @deprecated Use the new {@link findNearest} implementation
   * accepting a single `options` param.
   */
  //   findNearest(
  //     vectorField: string | FieldPath,
  //     queryVector: VectorValue | Array<number>,
  //     options: {
  //       limit: number;
  //       distanceMeasure: "EUCLIDEAN" | "COSINE" | "DOT_PRODUCT";
  //     }
  //   ): VectorQuery<AppModelType, DbModelType>;

  /**
   * Returns a query that can perform vector distance (similarity) search with given parameters.
   *
   * The returned query, when executed, performs a distance (similarity) search on the specified
   * `vectorField` against the given `queryVector` and returns the top documents that are closest
   * to the `queryVector`.
   *
   * Only documents whose `vectorField` field is a {@link VectorValue} of the same dimension as `queryVector`
   * participate in the query, all other documents are ignored.
   *
   * @example
   * ```
   * // Returns the closest 10 documents whose Euclidean distance from their 'embedding' fields are closed to [41, 42].
   * const vectorQuery = col.findNearest({
   *     vectorField: 'embedding',
   *     queryVector: [41, 42],
   *     limit: 10,
   *     distanceMeasure: 'EUCLIDEAN',
   *     distanceResultField: 'distance',
   *     distanceThreshold: 0.125
   * });
   *
   * const querySnapshot = await aggregateQuery.get();
   * querySnapshot.forEach(...);
   * ```
   * @param options - An argument specifying the behavior of the {@link VectorQuery} returned by this function.
   * See {@link VectorQueryOptions}.
   */
  //   findNearest(
  //     options: VectorQueryOptions
  //   ): VectorQuery<AppModelType, DbModelType>;

  /**
   * Returns true if this `Query` is equal to the provided one.
   *
   * @param other The `Query` to compare against.
   * @return true if this `Query` is equal to the provided one.
   */
  //   isEqual(other: Query<AppModelType, DbModelType>): boolean;

  /**
   * Applies a custom data converter to this Query, allowing you to use your
   * own custom model objects with Firestore. When you call get() on the
   * returned Query, the provided converter will convert between Firestore
   * data of type `NewDbModelType` and your custom type `NewAppModelType`.
   *
   * @param converter Converts objects to and from Firestore. Passing in
   * `null` removes the current converter.
   * @return A Query that uses the provided converter.
   */
  //   withConverter<
  //     NewAppModelType,
  //     NewDbModelType extends DocumentData = DocumentData,
  //   >(
  //     converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>
  //   ): Query<NewAppModelType, NewDbModelType>;
  //   withConverter(converter: null): Query;
}
