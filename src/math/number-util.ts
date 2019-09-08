export namespace NumberUtil {
  /** @arg min An integer < max
      @arg max An integer > min
      @return A value wrapped to the domain [min, max). */
  export const wrap = (val: number, min: number, max: number): number => {
    const range = max - min // range ∈ [0, +∞).
    const x = (val - min) % range // Subtract min and wrap to x ∈ (-range, range).
    const y = x + range // Translate to y ∈ (0, 2 * range).
    const z = y % range // Wrap to z ∈ [0, range).
    return z + min // Add min to return ∈ [min, max).
  }

  export const clamp = (val: number, min: number, max: number): number =>
    Math.min(Math.max(val, min), max)

  export const ceilMultiple = (multiple: number, val: number): number =>
    multiple ? Math.ceil(val / multiple) * multiple : 0
}
