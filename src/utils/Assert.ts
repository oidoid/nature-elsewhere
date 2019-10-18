export namespace Assert {
  export function assert(condition: unknown, msg?: string): asserts condition {
    if (!condition) throw new Error(msg)
  }

  export type TypePredicate<T> = (val: unknown) => val is T

  export function assertType<T>(
    fn: TypePredicate<T>,
    val: T
  ): asserts val is T {
    if (!fn(val)) throw new Error(`${fn.name}(${val}) failed type assertion.`)
  }
}
