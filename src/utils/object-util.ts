export namespace ObjectUtil {
  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(obj: T): ReadonlyArray<keyof T> {
    const keys: (keyof T)[] = []
    for (const key in obj) if (obj.hasOwnProperty(key)) keys.push(key)
    return keys
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(obj: T): ReadonlyArray<ValueOf<T>> {
    const vals: ValueOf<T>[] = []
    for (const key in obj) if (obj.hasOwnProperty(key)) vals.push(obj[key])
    return vals
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(obj: T): ReadonlyArray<[keyof T, ValueOf<T>]> {
    const entries: [keyof T, ValueOf<T>][] = []
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) entries.push([key, obj[key]])
    }
    return entries
  }

  /** Recursively freeze obj. */
  export function freeze<T extends object>(obj: T): Readonly<T> {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      const val = obj[name]
      const mutable = typeof val === 'object' || typeof val === 'function'
      obj[name] = mutable ? ObjectUtil.freeze(val) : val
    }
    return Object.freeze(obj)
  }
}
