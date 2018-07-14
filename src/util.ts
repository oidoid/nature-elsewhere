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
