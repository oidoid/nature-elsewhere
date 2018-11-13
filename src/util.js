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

/**
 * @arg {number} val A value.
 * @arg {number} min An integer < max
 * @arg {number} max An integer > min
 * @return {number} A value wrapped to the domain [min, max).
 */
export function wrap(val, min, max) {
  const range = max - min // range ∈ [0, +∞).
  const x = (val - min) % range // Subtract min and wrap to x ∈ (-range, range).
  const y = x + range // Translate to y ∈ (0, 2 * range).
  const z = y % range // Wrap to z ∈ [0, range).
  return z + min // Add min to return ∈ [min, max).
}

/**
 * @arg {number} x
 * @arg {number} min
 * @arg {number} max
 * @return {number}
 */
export function clamp(x, min, max) {
  return Math.min(max, Math.max(x, min))
}
