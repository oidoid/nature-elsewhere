import {Assert} from './Assert'

export namespace ObjectUtil {
  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(obj: T & object): readonly (keyof T)[] {
    const keys = []
    for (const key in obj) if (obj.hasOwnProperty(key)) keys.push(key)
    return keys
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(obj: T & object): readonly ValueOf<T>[] {
    const vals = []
    for (const key in obj) if (obj.hasOwnProperty(key)) vals.push(obj[key])
    return vals
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(
    obj: T & object
  ): readonly [keyof T, ValueOf<T>][] {
    return keys(obj).map(key => [key, obj[key]])
  }

  export function is(val: any): val is object {
    return val && val.constructor === Object
  }

  export function isKeyOf<T>(obj: T, key: keyof any): key is keyof T {
    return key in obj
  }

  export function isValueOf<T>(
    obj: T,
    val: string
  ): val is T[keyof T] & string {
    return Object.values(obj).includes(val)
  }

  export function assertKeyOf<T>(
    obj: T,
    key: keyof any,
    type: string
  ): key is keyof T {
    Assert.assert(isKeyOf(obj, key), `${type} missing "${key.toString()}" key.`)
    return true
  }

  export function assertValueOf<T>(
    obj: T,
    val: string,
    type: string
  ): val is T[keyof T] & string {
    Assert.assert(isValueOf(obj, val), `${type} missing "${val}" value.`)
    return true
  }
}
