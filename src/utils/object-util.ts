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
    keys(obj)
      .filter(key => typeof obj[key] === 'object')
      .forEach(key => {
        obj[key] = <T[keyof T] & object>freeze(<T[keyof T] & object>obj[key])
      })
    return Object.freeze(obj)
  }
}
