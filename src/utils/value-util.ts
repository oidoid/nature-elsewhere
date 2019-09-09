export namespace ValueUtil {
  /** Type guard. */
  export const is = <T>(val: Maybe<T> | null): val is T =>
    val !== null && val !== undefined
}
