export namespace Assert {
  export function assert(condition: unknown, msg?: string): void {
    if (!condition) throw new Error(msg)
  }
}
