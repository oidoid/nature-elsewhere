export namespace ArrayUtil {
  export function uniq<T>(
    equals: (lhs: T, rhs: T) => boolean
  ): Parameters<T[]['filter']>[0] {
    return (item: T, _: number, array: readonly T[]) =>
      array.findIndex(rhs => equals(item, rhs)) !== -1
  }

  /** Type guard. */
  export function is<T>(val: T | null | undefined): val is T {
    return val !== null && val !== undefined
  }

  export function range(
    start: number,
    end: number,
    step: number = start > end ? -1 : 1
  ): readonly number[] {
    return Array(Math.ceil(Math.abs((start - end) / step)))
      .fill(undefined)
      .reduce((sum: readonly number[], _, i) => [...sum, start + i * step], [])
  }
}
