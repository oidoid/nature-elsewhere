export namespace ValueUtil {
  /** Type guard. */
  export function is<T>(val: Maybe<T> | null): val is T {
    return val !== null && val !== undefined
  }
}
