// https://github.com/Microsoft/TypeScript/pull/12253
export function keys<T>(val: T & object): readonly (keyof T)[] {
  const keys: (keyof T)[] = []
  for (const key in val) if (val.hasOwnProperty(key)) keys.push(key)
  return keys
}

// https://github.com/Microsoft/TypeScript/pull/12253
export function values<T>(val: T & object): readonly ValueOf<T>[] {
  const vals: ValueOf<T>[] = []
  for (const key in val) if (val.hasOwnProperty(key)) vals.push(val[key])
  return vals
}

// https://github.com/Microsoft/TypeScript/pull/12253
export function entries<T>(val: T & object): readonly [keyof T, ValueOf<T>][] {
  return keys(val).map(key => [key, val[key]])
}

export function reverse<T>(val: Reversible<T>): Readonly<Reverse<T>> {
  const init = <Readonly<Reverse<T>>>{}
  return entries(val).reduce((sum, [key, val]) => ({...sum, [val]: key}), init)
}

export function hasKey<T>(val: T, key: keyof any): key is keyof T {
  return key in val
}
