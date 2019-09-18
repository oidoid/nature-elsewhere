export namespace ObjectUtil {
  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(obj: T & object): readonly (keyof T)[] {
    const ret = []
    for (const key in obj) if (obj.hasOwnProperty(key)) ret.push(key)
    return ret
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(obj: T & object): readonly T[keyof T][] {
    const ret = []
    for (const key in obj) if (obj.hasOwnProperty(key)) ret.push(obj[key])
    return ret
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(
    obj: T & object
  ): readonly [keyof T, T[keyof T]][] {
    return keys(obj).map(key => [key, obj[key]])
  }

  export function hasKey<T>(obj: T, key: keyof any): key is keyof T {
    return key in obj
  }

  export function assertHasKey<T>(obj: any, type: string, key: keyof T): T {
    if (hasKey(obj, key)) return obj
    throw new Error(`${type} has no "${key}" key.`)
  }

  export function isValueOf<T>(
    obj: T,
    val: string
  ): val is T[keyof T] & string {
    return Object.values(obj).includes(val)
  }

  export function assertValueOf<T>(
    obj: T,
    type: string,
    val: string
  ): T[keyof T] & string {
    if (isValueOf(obj, val)) return val
    throw new Error(`${type} has no "${val}" value.`)
  }

  export const defaultIfAbsent = <T, V>(
    obj: T,
    key: keyof T,
    fallback: V | T[keyof T]
  ): V | T[keyof T] => (key in obj ? obj[key] : fallback)

  export function prop<T, K extends keyof T = keyof T>(obj: T, key: K): T[K] {
    if (key in obj) return obj[key]
    throw new Error(`Missing ${key.toString()} property.`)
  }

  export const is = (val: any): val is object =>
    val && val.constructor === Object
  // export function ifUndefined<T, V>(
  //   obj: T,
  //   key: keyof T,
  //   fallback: V | T[keyof T]
  // ): V | T[keyof T] {
  //   return obj[key] === undefined ? fallback : obj[key]
  // }

  // export function fallback<T, K extends keyof T>(
  //   obj: T,
  //   key: K,
  //   fallback: Required<T>
  // ): Required<T>[K] {
  //   return obj[key] === undefined ? fallback[key] : obj[key]
  // }
}
