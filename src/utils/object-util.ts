export namespace ObjectUtil {
  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(obj: T): readonly (keyof T)[] {
    const keys: (keyof T)[] = []
    for (const key in obj) if (obj.hasOwnProperty(key)) keys.push(key)
    return keys
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(obj: T): readonly ValueOf<T>[] {
    const vals: ValueOf<T>[] = []
    for (const key in obj) if (obj.hasOwnProperty(key)) vals.push(obj[key])
    return vals
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(obj: T): readonly [keyof T, ValueOf<T>][] {
    const entries: [keyof T, ValueOf<T>][] = []
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) entries.push([key, obj[key]])
    }
    return entries
  }

}
