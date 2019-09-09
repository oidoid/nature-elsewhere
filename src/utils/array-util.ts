type FilterCallback<T> = Parameters<T[]['filter']>[0]

export namespace ArrayUtil {
  export const unique = <T>(
    equals: (lhs: T, rhs: T) => boolean
  ): FilterCallback<T> => (item: T, _: number, arr: readonly T[]) =>
    arr.findIndex(rhs => equals(item, rhs)) !== -1
}
