/**
 * @template T
 * @arg {ReadonlyArray<T>} arr
 * @arg {T | ReadonlyArray<T>} item
 * @return {ReadonlyArray<T>}
 */
export function flatten(arr, item) {
  return arr.concat(item)
}

/**
 * @arg {number} start
 * @arg {number} end
 * @arg {number} [step]
 * @return {ReadonlyArray<number>}
 */
export function range(start, end, step) {
  const interval = step ? step : start > end ? -1 : 1
  return Array(Math.ceil(Math.abs((start - end) / interval)))
    .fill(undefined)
    .reduce(
      (/** @type ReadonlyArray<number> */ sum, _, i) => [
        ...sum,
        start + i * interval
      ],
      []
    )
}

/**
 * https://github.com/Microsoft/TypeScript/pull/12253
 * @template T
 * @arg {T} obj
 * @return {ReadonlyArray<keyof T>}
 */
export function keys(obj) {
  /** @type {(keyof T)[]} */ const keys = []
  for (const key in obj) if (obj.hasOwnProperty(key)) keys.push(key)
  return keys
}

/**
 * https://github.com/Microsoft/TypeScript/pull/12253
 * @template T
 * @arg {T} obj
 * @return {ReadonlyArray<[keyof T, ValueOf<T>]>}
 */
export function entries(obj) {
  /** @type {[keyof T, ValueOf<T>][]} */ const keys = []
  for (const key in obj) if (obj.hasOwnProperty(key)) keys.push([key, obj[key]])
  return keys
}

/**
 * Keep enum typing.
 * @template T
 * @arg {T} obj
 * @return {ReadonlyArray<ValueOf<T>>}
 */
export function values(obj) {
  /** @type {ValueOf<T>[]} */ const vals = []
  for (const key in obj) if (obj.hasOwnProperty(key)) vals.push(obj[key])
  return vals
}

/**
 * @template T
 * @arg {Equals<T>} equals E.g., {@link Object.is}.
 * @return {(value: T, index: number, array: ReadonlyArray<T>) => boolean}
 */
export function uniq(equals) {
  return (item, _, array) => array.findIndex(rhs => equals(item, rhs)) !== -1
}
