export namespace Assert {
  export function assert(condition: unknown, msg?: string): void {
    if (!condition) throw new Error(msg)
  }

  export type TypePredicate<T> = (val: unknown) => val is T

  export function assertType<T>(fn: TypePredicate<T>, val: T): T {
    if (fn(val)) return val
    throw new Error(`${fn.name}(${val}) failed type assertion.`)
  }
}
