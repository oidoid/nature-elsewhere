export function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function rndInt(min: number, max: number): number {
  return Math.floor(rnd(min, max + 1))
}

export function flatten<T>(arr: T[], item: T | T[]): T[] {
  return arr.concat(item)
}

export function range(start: number, end: number, step?: number): number[] {
  const interval = step ? step : start > end ? -1 : 1
  return Array(Math.ceil(Math.abs((start - end) / interval)))
    .fill(undefined)
    .reduce((sum: number[], _, i) => [...sum, start + i * interval], [])
}

// https://github.com/Microsoft/TypeScript/pull/12253
export function keys<T>(obj: T): (keyof T)[] {
  const keys: (keyof T)[] = []
  for (const key in obj) if (obj.hasOwnProperty(key)) keys.push(key)
  return keys
}

// https://github.com/Microsoft/TypeScript/pull/12253
export function entries<T>(obj: T): [keyof T, T[keyof T]][] {
  const keys: [keyof T, T[keyof T]][] = []
  for (const key in obj) if (obj.hasOwnProperty(key)) keys.push([key, obj[key]])
  return keys
}

// Keep enum typing.
export function values<T>(obj: T): T[keyof T][] {
  const vals: T[keyof T][] = []
  for (const key in obj) if (obj.hasOwnProperty(key)) vals.push(obj[key])
  return vals
}

/** @param {Equals} equals E.g., {@link Object.is}. */
export function uniq<T>(
  equals: Equals<T>
): (value: T, index: number, array: T[]) => boolean {
  return (item, _, array) => array.findIndex(rhs => equals(item, rhs)) !== -1
}
