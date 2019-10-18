import {Assert} from './Assert'

export namespace ObjectUtil {
  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(obj: T & object): (keyof T)[] {
    const keys = []
    for (const key in obj) if (obj.hasOwnProperty(key)) keys.push(key)
    return keys
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(obj: T & object): ValueOf<T>[] {
    const vals = []
    for (const key in obj) if (obj.hasOwnProperty(key)) vals.push(obj[key])
    return vals
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(obj: T & object): [keyof T, ValueOf<T>][] {
    return keys(obj).map(key => [key, obj[key]])
  }

  export function is(val: any): val is object {
    return val && val.constructor === Object
  }

  export function isKeyOf<T>(obj: T, key: keyof any): key is keyof T {
    return key in obj
  }

  export function isValueOf<T>(obj: T, val: unknown): val is T[keyof T] {
    return Object.values(obj).includes(val)
  }

  export function assertKeyOf<T>(
    obj: T,
    key: keyof any,
    type: string
  ): asserts key is keyof T {
    Assert.assert(isKeyOf(obj, key), `${type} missing "${key.toString()}" key.`)
  }

  export function assertValueOf<T>(
    obj: T,
    val: unknown,
    type: string
  ): asserts val is ValueOf<T> {
    Assert.assert(isValueOf(obj, val), `${type} missing "${val}" value.`)
  }

  export function definedEntry<T, K extends keyof T = keyof T>(
    record: T,
    key: K
  ): {} | Record<K, Required<T>[K]> {
    return record[key] === undefined ? {} : {[key]: record[key]}
  }

  /** Recursively freeze obj. */
  export function freeze<T extends object>(obj: T): DeepImmutable<T> {
    for (const key of keys(obj))
      if (is(obj[key]))
        obj[key] = <ValueOf<T>>freeze(<ValueOf<T> & object>obj[key])
    return <DeepImmutable<T>>Object.freeze(obj)
  }
}
