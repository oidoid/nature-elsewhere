import {Integer} from 'aseprite-atlas'

export namespace NumberUtil {
  /** @arg min An integer < max
      @arg max An integer > min
      @return A value wrapped to the domain [min, max). */
  export function wrap(val: number, min: number, max: number): number {
    const range = max - min // range ∈ [0, +∞).
    const x = (val - min) % range // Subtract min and wrap to x ∈ (-range, range).
    const y = x + range // Translate to y ∈ (0, 2 * range).
    const z = y % range // Wrap to z ∈ [0, range).
    return z + min // Add min to return ∈ [min, max).
  }

  export function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max)
  }

  export function ceilMultiple(multiple: number, val: number): number {
    // n / 0 * 0 = NaN
    return multiple ? Math.ceil(val / multiple) * multiple : 0
  }

  export function lerp(from: number, to: number, ratio: number): number {
    return from * (1 - ratio) + to * ratio
  }

  /** @return Monotonically increasing or decreasing integer towards to or
              to. */
  export function lerpInt(from: Integer, to: Integer, ratio: number): Integer {
    const interpolation = Math.trunc(lerp(from, to, ratio))
    return (
      interpolation +
      // Nonzero when not to, zero when to.
      Math.sign(to - interpolation) -
      // Nonzero when progressing towards to, zero when not progressing or at to.
      Math.sign(interpolation - from)
    )
  }
}
