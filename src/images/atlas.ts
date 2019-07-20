import * as Aseprite from '../aseprite/aseprite'

export type State = Readonly<Record<string, Animation>>

/** Animation and collision frames. Dimensions are identical for every cel. */
export interface Animation extends WH {
  readonly cels: readonly Cel[]
  /** Positive animation length in milliseconds for a full cycle, possibly
   *  infinite. For a ping-pong animation, this is a full traversal forward plus
   *  traversal backward excluding the first and last frame. */
  readonly duration: number
  readonly direction: AnimationDirection
}

/** A single frame of an animation sequence. */
export interface Cel extends XY {
  /** Positive cel exposure in milliseconds, possibly infinite. */
  readonly duration: number
  /** Collision bounds within the texture in pixels. */
  readonly collision: readonly Rect[]
}

export import AnimationDirection = Aseprite.AnimationDirection
