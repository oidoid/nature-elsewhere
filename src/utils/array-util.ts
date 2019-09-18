export namespace ArrayUtil {
  export function unique<T>(
    equals: (lhs: T, rhs: T) => boolean
  ): FilterCallback<T> {
    return (item, _, arr) => arr.findIndex(rhs => equals(item, rhs)) !== -1
  }
}

type FilterCallback<T> = Parameters<T[]['filter']>[0]
