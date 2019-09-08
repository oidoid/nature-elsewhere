type FilterCallback<T> = Parameters<T[]['filter']>[0]

export namespace ArrayUtil {
  export const unique = <T>(
    equals: (lhs: T, rhs: T) => boolean
  ): FilterCallback<T> => (item: T, _: number, array: readonly T[]) =>
    array.findIndex(rhs => equals(item, rhs)) !== -1

  /** Type guard. */
  export const is = <T>(val: Maybe<T> | null): val is T =>
    val !== null && val !== undefined
}
