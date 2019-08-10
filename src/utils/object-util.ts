export namespace ObjectUtil {
  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(val: T & object): readonly (keyof T)[] {
    const keys = []
    for (const key in val) if (val.hasOwnProperty(key)) keys.push(key)
    return keys
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(val: T & object): readonly ValueOf<T>[] {
    const vals = []
    for (const key in val) if (val.hasOwnProperty(key)) vals.push(val[key])
    return vals
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(
    val: T & object
  ): readonly [keyof T, ValueOf<T>][] {
    return keys(val).map(key => [key, val[key]])
  }

  export function reverse<T>(
    val: Readonly<Reversible<T>>
  ): Readonly<Reverse<T>> {
    return entries(val).reduce((sum, [key, val]) => ({...sum, [val]: key}), <
      Readonly<Reverse<T>>
    >{})
  }

  export function defaultIfAbsent<T, V = ValueOf<T>>(
    obj: T,
    key: keyof T,
    fallback: V | ValueOf<T>
  ): V | ValueOf<T> {
    return key in obj ? obj[key] : fallback
  }

  export function hasKey<T>(val: T, key: keyof any): key is keyof T {
    return key in val
  }
}
