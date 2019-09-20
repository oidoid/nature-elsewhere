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

  export function is(val: any): val is object {
    return val && val.constructor === Object
  }

  export function hasKey<T>(obj: T, key: keyof any): key is keyof T {
    return key in obj
  }

  export function hasValue<T>(obj: T, val: string): val is T[keyof T] & string {
    return Object.values(obj).includes(val)
  }
}
